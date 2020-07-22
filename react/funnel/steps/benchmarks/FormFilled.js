import React, { useState } from 'react';
import { registerStepType, SimpleEditModal } from '../steps';
import { Button, Col, Row, Tab, Tabs } from 'react-bootstrap';
import {
	ClearFix,
	CopyInput,
	LinkPicker, TagSpan,
	TextArea,
	YesNoToggle,
} from '../../components/BasicControls/basicControls';

import '../../../../assets/css/frontend/form.css';
import { ReactSortable } from 'react-sortablejs';
import { Dashicon } from '../../components/Dashicon/Dashicon';
import { parseArgs, uniqId } from '../../App';

const { __, _x, _n, _nx } = wp.i18n;

registerStepType('form_fill', {

	icon: ghEditor.steps.form_fill.icon,
	group: ghEditor.steps.form_fill.group,

	title: ({ data, context, settings }) => {
		return <>{ _x( 'When', 'form step title', 'groundhogg' ) } <TagSpan icon={'editor-table'} tagName={settings.form_name}/> { _x( 'is filled', 'form step title', 'groundhogg' ) }</>;
	},

	edit: ({ data, context, settings, updateSettings, commit, done }) => {

		const updateSetting = (name, value) => {
			updateSettings({
				[name]: value,
			});
		};

		const [tab, setTab] = useState('form');

		return (
			<SimpleEditModal
				title={ 'Form Filled...' }
				done={ done }
				commit={ commit }
				modalProps={ {
					size: 'lg',
					dialogClassName: tab === 'form'
						? 'modal-90w form'
						: 'modal-md form',
				} }
				modalBodyProps={ {
					className: 'no-padding',
				} }
			>
				<Tabs activeKey={ tab } onSelect={ (t) => setTab(t) }>
					{ Object.keys(editFormTabs).
						map(tab => renderTab(tab, data, settings, context,
							updateSettings, updateSetting)) }
				</Tabs>
			</SimpleEditModal>
		);
	},
});

function renderTab (
	tab, data, settings, context, updateSettings, updateSetting) {
	const tabContent = React.createElement(editFormTabs[tab].render, {
		data: data,
		settings: settings,
		context: context,
		updateSettings: updateSettings,
		updateSetting: updateSetting,
	});

	return (
		<Tab eventKey={ tab } title={ editFormTabs[tab].title }>
			{ tabContent }
		</Tab>
	);
}

const editFormTabs = {
	form: {
		id: 'form',
		title: __( 'Form', 'tab name', 'groundhogg' ),
		render: ({ context, settings, updateSettings, updateSetting }) => {

			const formUpdated = (newJson) => {
				updateSettings({
					form_json: newJson,
				});
			};

			const formJSON = settings.form_json || context.default_form_json;

			return (
				<>
					<FormBuilder
						formJSON={ formJSON }
						formUpdated={ formUpdated }
						settings={ settings }
						updateSetting={ updateSetting }
					/>
				</>
			);
		},
	},
	submit: {
		id: 'submit',
		title: __( 'Submit', 'tab name', 'groundhogg' ),
		render: ({ settings, updateSetting }) => {
			return (
				<>
					<Row className={ 'step-setting-control no-margins' }>
						<Col sm={ 4 }>
							<label>{ __( 'Stay on page after submit?', 'groundhogg' ) }</label>
							<p className={ 'description' }>{ __( 'This will prevent the contact from being redirected after submitting the form.', 'groundogg' ) }</p>
						</Col>
						<Col sm={ 8 }>
							<YesNoToggle
								value={ settings.enable_ajax }
								update={ (v) => updateSetting('enable_ajax',
									v) }
							/>
						</Col>
					</Row>
					{ settings.enable_ajax && <Row className={ 'no-margins' }>
						<Col sm={ 4 }>
							<label>{ 'Success message' }</label>
							<p className={ 'description' }>{ 'Message displayed when the contact submits the form.' }</p>
						</Col>
						<Col sm={ 8 }>
							<TextArea
								id={ 'success_message' }
								value={ settings.success_message }
								hasReplacements={ true }
								update={ (v) => updateSetting(
									'success_message', v) }/>
						</Col>
					</Row> }
					{ !settings.enable_ajax && <Row className={ 'no-margins' }>
						<Col sm={ 4 }>
							<label>{ 'Success page' }</label>
							<p className={ 'description' }>{ 'Where the contact will be directed upon submitting the form.' }</p>
						</Col>
						<Col sm={ 8 }>
							<LinkPicker value={ settings.success_page }
							            update={ (v) => updateSetting(
								            'success_page', v) }/>
						</Col>
					</Row> }
				</>
			);
		},
	},
	embed: {
		id: 'embed',
		title: __( 'Embed', 'groundhogg' ),
		render: ({ context }) => {
			return ( <>
				<Row className={ 'step-setting-control no-margins' }>
					<Col sm={ 4 }>
						<label>{ 'Shortcode' }</label>
						<p className={ 'description' }>{ 'Insert anywhere WordPress shortcodes are accepted.' }</p>
					</Col>
					<Col sm={ 8 }>
						<CopyInput
							content={ context.embed.shortcode }
						/>
					</Col>
				</Row>
				<Row className={ 'step-setting-control no-margins' }>
					<Col sm={ 4 }>
						<label>{ 'iFrame' }</label>
						<p className={ 'description' }>{ 'For use when embedding forms on none WordPress sites.' }</p>
					</Col>
					<Col sm={ 8 }>
						<CopyInput
							content={ context.embed.iframe }
						/>
					</Col>
				</Row>
				<Row className={ 'step-setting-control no-margins' }>
					<Col sm={ 4 }>
						<label>{ 'Raw HTML' }</label>
						<p className={ 'description' }>{ 'For use when embedding forms on none WordPress sites and HTML web form integrations (Thrive).' }</p>
					</Col>
					<Col sm={ 8 }>
						<CopyInput
							content={ context.embed.html }
						/>
					</Col>
				</Row>
				<Row className={ 'step-setting-control no-margins' }>
					<Col sm={ 4 }>
						<label>{ 'Hosted URL' }</label>
						<p className={ 'description' }>{ 'Direct link to the web form.' }</p>
					</Col>
					<Col sm={ 8 }>
						<CopyInput
							content={ context.embed.hosted }
						/>
					</Col>
				</Row>
			</> );
		},
	},
};

function FormBuilder ({ formJSON, formUpdated, settings, updateSetting }) {

	return (
		<Row className={ 'no-margins no-padding' }>
			<Col className={ 'no-padding form-builder-wrap' }>
				<div className={ 'form-builder-wrap' }>
					<div className={ 'form-name-wrap' }>
						<label>{ 'Form Name' }</label>
						<input
							type={ 'text' }
							value={ settings.form_name }
							className={ 'form-name alignright' }
							onChange={ e => updateSetting('form_name',
								e.target.value) }
						/>
						<ClearFix/>
					</div>
					<FieldsEditor
						fields={ formJSON }
						formUpdated={ formUpdated }
					/>
				</div>
			</Col>
			<Col className={ 'form-preview' }>
				{ formJSON.map((field) => renderField(field)) }
				<ClearFix/>
			</Col>
		</Row>
	);
}

function FieldsEditor ({ fields, formUpdated }) {

	const [active, setActive] = useState(false);

	const addField = () => {
		fields.push({
			type: 'text',
			id: uniqId('field_'),
			width: '1/1',
			attributes: {
				label: 'my field',
			},
		});

		formUpdated(fields);
	};

	const deleteField = (fieldId, e) => {
		e.stopPropagation();
		formUpdated(fields.filter(field => field.id !== fieldId));
	};

	const editField = (fieldId) => {
		setActive(fields.find(field => field.id === fieldId));
	};

	const updateField = (fieldId, name, value) => {
		const i = fields.map(field => field.id).indexOf(fieldId);
		fields[i][name] = value;
		formUpdated(fields);
	};

	const doneEditing = () => {
		setActive(false);
	};

	if (active) {
		return (
			<div className={ 'form-fields' }>
				<FieldEditor
					field={ active }
					updateField={ updateField }
					onEdit={ doneEditing }
				/>
			</div>
		);
	}

	return (
		<>
			<ReactSortable
				list={ fields }
				setList={ formUpdated }
				className={ 'form-fields' }
			>
				{ fields.map(field => <FieldSortable
					field={ field }
					onDelete={ deleteField }
					onEdit={ editField }
				/>) }
			</ReactSortable>
			<div className={ 'add-field-wrap' }>
				<Button variant={ 'outline-secondary' } onClick={ addField }>
					<Dashicon icon={ 'plus' }/>
					{ 'Add Field' }
				</Button>
			</div>
		</>
	);
}

function FieldLabel ({ field }) {
	let name;

	if (FieldTypes.hasOwnProperty(field.type) &&
		FieldTypes[field.type].hasOwnProperty('renderName')) {
		// console.debug( field );
		name = FieldTypes[field.type].renderName(field.attributes);
	}
	else {
		name = field.attributes.label;
	}

	return <span className={ 'field-label' }>{ name }</span>;
}

function FieldSortable ({ field, onDelete, onEdit }) {

	return (
		<div
			key={ field.id }
			className={ 'field-sortable-item form-field' }
			onClick={ (e) => onEdit(field.id) }
		>
			<FieldLabel field={ field }/>
			<button
				className={ 'delete-field-button' }
				onClick={ (e) => onDelete(field.id, e) }
			>
				<Dashicon icon={ 'no-alt' }/>
			</button>
		</div>
	);

}

function FieldEditor ({ field, onEdit, updateField }) {

	const attrs = FieldTypes[field.type].attributes;
	const attributes = field.attributes;
	const fieldId = field.id;

	const updateAttribute = (attr, value) => {
		attributes[attr] = value;
		updateField(fieldId, 'attributes', attributes);
	};

	return (
		<>
			<div
				key={ field.id }
				className={ 'field-sortable-item form-field' }
				onClick={ onEdit }
			>
				<FieldLabel field={ field }/>
				<button
					onClick={ onEdit }
					className={ 'edit-field-button' }
				>
					<Dashicon icon={ 'yes' }/>
				</button>
			</div>
			<div className={ 'field-attributes' }>
				<BasicAttributeControlGroup
					label={ 'Field Type' }
				>
					<select value={ field.type }
					        onChange={ (e) => updateField(fieldId, 'type',
						        e.target.value) }>
						{ Object.values(FieldTypes).
							map(type => <option
								value={ type.type }>{ type.name }</option>) }
					</select>
				</BasicAttributeControlGroup>
				{ attrs.map(attr => <FieldAttribute
					type={ attr }
					value={ attributes[attr] }
					updateAttribute={ updateAttribute }
				/>) }
				<BasicAttributeControlGroup
					label={ 'Column Width' }
				>
					<select value={ field.width }
					        onChange={ (e) => updateField(fieldId, 'width',
						        e.target.value) }>
						{ Object.keys(widthMap).
							map(width => <option
								value={ width }>{ width }</option>) }
					</select>
				</BasicAttributeControlGroup>
			</div>
		</>
	);
}

function FieldAttribute ({ type, value, updateAttribute }) {

	if (!fieldAttributes.hasOwnProperty(type)) {
		return <div className={ 'not-implemented' }>{ 'Not implemented' }</div>;
	}

	return React.createElement(fieldAttributes[type].edit, {
		value: value,
		updateAttribute: updateAttribute,
	});

}

function BasicAttributeControlGroup ({ label, children }) {
	return (
		<Row className={ 'field-attribute-control' }>
			<Col>
				<label>{ label }</label>
			</Col>
			<Col>
				{ children }
			</Col>
		</Row>
	);
}

const fieldAttributes = {
	required: {
		edit: ({ value, updateAttribute }) => {
			return (
				<Row className={ 'field-attribute-control' }>
					<Col>
						<label>{ 'Is this field required?' }</label>
					</Col>
					<Col>
						<YesNoToggle
							value={ value }
							update={ (value) => updateAttribute('required',
								value) }
						/>
					</Col>
				</Row>
			);
		},
	},
	label: {
		edit: ({ value, updateAttribute }) => {
			return (
				<Row className={ 'field-attribute-control' }>
					<Col>
						<label>{ 'Field Label' }</label>
					</Col>
					<Col>
						<input
							type={ 'text' }
							value={ value }
							onChange={ (e) => updateAttribute('label',
								e.target.value) }
						/>
					</Col>
				</Row>
			);
		},
	},
	text: {
		edit: ({ value, updateAttribute }) => {
			return (
				<BasicAttributeControlGroup
					label={ 'Button Text' }
				>
					<input
						type={ 'text' }
						value={ value }
						onChange={ (e) => updateAttribute('text',
							e.target.value) }
					/>
				</BasicAttributeControlGroup>
			);
		},
	},
	hideLabel: {
		edit: ({ value, updateAttribute }) => {
			return (
				<Row className={ 'field-attribute-control' }>
					<Col>
						<label>{ 'Hide field label?' }</label>
					</Col>
					<Col>
						<YesNoToggle
							value={ value }
							update={ (value) => updateAttribute('hideLabel',
								value) }
						/>
					</Col>
				</Row>
			);
		},
	},
	name: {
		edit: ({ value, updateAttribute }) => {
			return (
				<BasicAttributeControlGroup
					label={ 'Custom Field Name' }
				>
					<textarea
						value={ value }
						onChange={ (e) => updateAttribute('text',
							e.target.value) }
					/>
				</BasicAttributeControlGroup>
			);
		},
	},
	description: {
		edit: ({ value, updateAttribute }) => {
			return (
				<BasicAttributeControlGroup
					label={ 'Field Description' }
				>
					<textarea
						value={ value }
						onChange={ (e) => updateAttribute('text',
							e.target.value) }
					/>
				</BasicAttributeControlGroup>
			);
		},
	},
	showDescription: {
		edit: ({ value, updateAttribute }) => {
			return (
				<Row className={ 'field-attribute-control' }>
					<Col>
						<label>{ 'Show description?' }</label>
					</Col>
					<Col>
						<YesNoToggle
							value={ value }
							update={ (value) => updateAttribute('showDescription',
								value) }
						/>
					</Col>
				</Row>
			);
		},
	},
	placeholder: {
		edit: ({ value, updateAttribute }) => {
			return (
				<Row className={ 'field-attribute-control' }>
					<Col>
						<label>{ 'Placeholder' }</label>
					</Col>
					<Col>
						<input
							type={ 'text' }
							value={ value }
							onChange={ (e) => updateAttribute('placeholder',
								e.target.value) }
						/>
					</Col>
				</Row>
			);
		},
	},
	id: {
		edit: ({ value, updateAttribute }) => {
			return (
				<Row className={ 'field-attribute-control' }>
					<Col>
						<label>{ 'CSS ID' }</label>
					</Col>
					<Col>
						<input
							type={ 'text' }
							value={ value }
							onChange={ (e) => updateAttribute('ID',
								e.target.value) }
						/>
					</Col>
				</Row>
			);
		},
	},
	class: {
		edit: ({ value, updateAttribute }) => {
			return (
				<Row className={ 'field-attribute-control' }>
					<Col>
						<label>{ 'CSS Class' }</label>
					</Col>
					<Col>
						<input
							type={ 'text' }
							value={ value }
							onChange={ (e) => updateAttribute('class',
								e.target.value) }
						/>
					</Col>
				</Row>
			);
		},
	},
};

const FieldTypes = {
	first: {
		type: 'first',
		name: 'First',
		attributes: [
			'label',
			'hideLabel',
			'required',
			'placeholder',
			'id',
			'class',
		],
		render: function ({ attributes }) {

			attributes = parseArgs(attributes, {
				label: 'First Name',
				required: true,
			});

			attributes = parseArgs({
				name: 'first_name',
			}, attributes);

			return <InputFieldGroup
				type={ 'text' }
				attributes={ attributes }
			/>;
		},
	},
	last: {
		type: 'last',
		name: 'Last',
		attributes: [
			'label',
			'hideLabel',
			'required',
			'placeholder',
			'id',
			'class',
		],
		render: function ({ attributes }) {

			attributes = parseArgs(attributes, {
				label: 'Last Name',
				required: true,
			});

			attributes = parseArgs({
				name: 'last_name',
			}, attributes);

			return <InputFieldGroup
				type={ 'text' }
				attributes={ attributes }
			/>;
		},
	},
	email: {
		type: 'email',
		name: 'Email',
		attributes: [
			'label',
			'hideLabel',
			'placeholder',
			'id',
			'class',
		],
		render: function ({ attributes }) {

			attributes = parseArgs(attributes, {
				label: 'Email',
			});

			attributes = parseArgs({
				name: 'email',
				required: true,
			}, attributes);

			return <InputFieldGroup
				type={ 'email' }
				attributes={ attributes }
			/>;
		},
	},
	phone: {
		type: 'phone',
		name: 'Phone',
		attributes: ['required', 'label', 'placeholder', 'id', 'class'],
		render: function ({ attributes }) {

			attributes = parseArgs(attributes, {
				label: 'Phone',
				required: true,
			});

			attributes = parseArgs({
				name: 'primary_phone',
			}, attributes);

			return <InputFieldGroup
				type={ 'tel' }
				attributes={ attributes }
			/>;
		},
	},
	gdpr: {
		type: 'gdpr',
		name: 'GDPR',
		attributes: ['label', 'tag', 'id', 'class'],
		render: function ({ attributes }) {

			attributes = parseArgs(attributes, {
				class: 'gh-gdpr',
				label: 'I consent...',
			});

			attributes = parseArgs( {
				name: 'gdpr_consent',
				id: 'gdpr_consent',
				required: true,
				value: 'yes',
			}, attributes );

			return <CheckboxFieldGroup
				attributes={ attributes }
			/>;
		},
	},
	terms: {
		type: 'terms',
		name: 'Terms',
		attributes: ['label', 'tag', 'id', 'class'],
		render: function ({ attributes }) {

			attributes = parseArgs(attributes, {
				class: 'gh-terms',
				label: <>{ 'I agree to the' } <i>{ 'terms of service' }</i></>,
				required: true,
			});

			attributes = parseArgs( {
				name: 'agree_terms',
				id: 'agree_terms',
				value: 'yes',
			}, attributes );

			return <CheckboxFieldGroup
				attributes={ attributes }
			/>;
		},
	},
	recaptcha: {
		type: 'recaptcha',
		name: 'reCaptcha',
		attributes: ['captcha-theme', 'captcha-size', 'id', 'class'],
	},
	submit: {
		type: 'submit',
		name: 'Submit',
		attributes: ['text', 'id', 'class'],
		renderName: (attributes) => {
			return attributes.text;
		},
		render: function ({ attributes }) {

			attributes = parseArgs(attributes, {
				text: 'Submit',
			});

			return ( <div className={ 'gh-button-wrapper' }>
				<button type={ 'submit' } id={ attributes.id }
				        className={ ['gh-submit-button', attributes.class].join(
					        ' ') }>
					{ attributes.text }
				</button>
			</div> );
		},
	},
	text: {
		type: 'text',
		name: 'Text',
		attributes: [
			'required',
			'label',
			'placeholder',
			'name',
			'id',
			'class',
		],
		render: function ({ attributes }) {
			return <InputFieldGroup
				type={ 'text' }
				attributes={ attributes }
			/>;
		},
	},
	textarea: {
		type: 'textarea',
		name: 'Textarea',
		attributes: [
			'required',
			'label',
			'placeholder',
			'name',
			'id',
			'class',
		],
		render: function ({ attributes }) {
			return <BasicFieldGroup
				label={attributes.label}
				hideLabel={attributes.hideLabel}
				isRequired={attributes.required}
			>
				<textarea
					id={ attributes.id }
					className={ ['gh-input', attributes.class].join(' ') }
					name={ attributes.name }
					value={ attributes.value }
					placeholder={ attributes.placeholder }
					title={ attributes.title }
					required={ attributes.required }
				/>
			</BasicFieldGroup>;
		},
	},
	number: {
		type: 'number',
		name: 'Number',
		attributes: [
			'required',
			'label',
			'name',
			'min',
			'max',
			'id',
			'class',
		],
		render: function ({ attributes }) {
			return <InputFieldGroup
				type={ 'number' }
				attributes={ attributes }
				inputProps={{
					min: attributes.min,
					max: attributes.max,
				}}
			/>;
		},
	},
	dropdown: {
		type: 'dropdown',
		name: 'Dropdown',
		attributes: [
			'required',
			'label',
			'name',
			'default',
			'options',
			'multiple',
			'id',
			'class',
		],
	},
	radio: {
		type: 'radio',
		name: 'Radio',
		attributes: ['required', 'label', 'name', 'options', 'id', 'class'],
	},
	checkbox: {
		type: 'checkbox',
		name: 'Checkbox',
		attributes: [
			'required',
			'label',
			'name',
			'value',
			'tag',
			'id',
			'class',
		],
		render: function ({ attributes }) {
			return <CheckboxFieldGroup
				attributes={ attributes }
			/>;
		},
	},
	address: {
		type: 'address',
		name: 'Address',
		attributes: ['required', 'label', 'id', 'class'],
	},
	birthday: {
		type: 'birthday',
		name: 'Birthday',
		attributes: ['required', 'label', 'id', 'class'],
	},
	date: {
		type: 'date',
		name: 'Date',
		attributes: [
			'required',
			'label',
			'name',
			'min_date',
			'max_date',
			'id',
			'class',
		],
	},
	time: {
		type: 'time',
		name: 'Time',
		attributes: [
			'required',
			'label',
			'name',
			'min_time',
			'max_time',
			'id',
			'class',
		],
	},
	file: {
		type: 'file',
		name: 'File',
		attributes: [
			'required',
			'label',
			'name',
			'max_file_size',
			'file_types',
			'id',
			'class',
		],
	},
};

const widthMap = {
	'1/1': 'col-1-of-1',
	'1/2': 'col-1-of-2',
	'1/3': 'col-1-of-3',
	'1/4': 'col-1-of-4',
	'2/3': 'col-2-of-3',
	'3/4': 'col-3-of-4',
};

function renderField (field) {

	if (!FieldTypes.hasOwnProperty(field.type)) {

		return <div className={ 'nor-implemented' }>{ 'not implemented' }</div>;
	}
	const input = React.createElement(FieldTypes[field.type].render, {
		attributes: field.attributes || {},
		children: field.children || [],
	});

	return (
		<div key={ field.id } className={ [
			'gh-form-column',
			widthMap[field.width],
		].join(' ') }>
			{ input }
		</div>
	);

}

function BasicFieldGroup ({hideLabel, label, isRequired, children}) {

	if (hideLabel) {
		return <>{children}</>;
	}

	return (
		<label className={ 'gh-input-label' }>
			{ label } { isRequired &&
		<span className={ 'is-required' }>*</span> }
			{children}
		</label>
	);
}

/**
 *
 * @param type
 * @param attributes
 * @param inputProps
 * @returns {*}
 * @constructor
 */
function InputFieldGroup ({ type, attributes, inputProps }) {

	attributes = parseArgs(attributes, {
		hideLabel: false,
	});

	const input = <input
		type={ type }
		id={ attributes.id }
		className={ ['gh-input', attributes.class].join(' ') }
		name={ attributes.name }
		value={ attributes.value }
		placeholder={ attributes.placeholder }
		title={ attributes.title }
		required={ attributes.required }
		{ ...inputProps }
	/>;

	if (attributes.hideLabel) {
		return input;
	}

	return (
		<label className={ 'gh-input-label' }>
			{ attributes.label } { attributes.required &&
		<span className={ 'is-required' }>*</span> }
			{ input }
		</label>
	);
}

/**
 *
 * @param attributes
 * @param inputProps
 * @returns {*}
 * @constructor
 */
function CheckboxFieldGroup ({ attributes, inputProps }) {

	const input = <input
		type={ 'checkbox' }
		id={ attributes.id }
		className={ ['gh-checkbox', attributes.class].join(' ') }
		name={ attributes.name }
		value={ attributes.value }
		title={ attributes.title }
		required={ attributes.required }
		{ ...inputProps }
	/>;

	return (
		<label
			className={ 'gh-checkbox-label' }>{ input } { attributes.label } { attributes.required &&
		<span className={ 'is-required' }>*</span> }
		</label>
	);
}

InputFieldGroup.defaultProps = {
	type: 'text',
	attributes: {},
};

function prettifyForm (form) {

	form = form.trim().
		replace(/(\])\s*(\[)/gm, '$1$2').
		replace(/(\])/gm, '$1\n');

	// form = form.trim().replace(/(\])\s*(\[)/gm, "$1$2").replace(/(\])/gm,
	let codes = form.split('\n');
	// console.debug(codes);

	let depth = 0;

	let pretty = '';
	codes.forEach(function (shortcode, i) {

		shortcode = shortcode.trim();

		if (!shortcode) {

			return;
		}
		if (shortcode.match(/\[(col|row)\b[^\]]*\]/)) {

			pretty += ' '.repeat(4).repeat(depth) + shortcode;
			depth++;
		}
		else if (shortcode.match(/\[\/(col|row)\]/)) {
			depth--;
			pretty += ' '.repeat(4).repeat(depth) + shortcode;
		}
		else {
			pretty += ' '.repeat(4).repeat(depth) + shortcode;
		}
		pretty += '\n';

		// "$1\n");
	});

	return pretty;

}