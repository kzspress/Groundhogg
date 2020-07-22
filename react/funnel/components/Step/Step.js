import React from 'react';

import { StepControls } from './StepControls/StepControls';
import { StepIcon } from './StepIcon/StepIcon';

import './component.scss';
import { showAddStepForm } from '../AddStep/AddStep';
import axios from 'axios';
import { reloadEditor } from '../Editor/Editor';
import { FadeOut } from '../Animations/Animations';
import { DelayControl } from './DelayControl/DelayControl';
import { StepEdit, StepTitle } from '../../steps/steps';
import { objEquals } from '../../App';

export class Step extends React.Component {

	constructor (props) {
		super(props);

		this.state = {
			deleting: false,
			editing: false,
			saving: false,
			deleted: false,
			settings: props.step.settings,
			tempSettings: {},
			context: props.step.context,
			tempContext: {},
			data: props.step.data,
		};

		this.handleControlAction = this.handleControlAction.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.stopEditing = this.stopEditing.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.afterFadeOut = this.afterFadeOut.bind(this);
		this.updateSettings = this.updateSettings.bind(this);
		this.commitSettings = this.commitSettings.bind(this);
	}

	handleEdit (e) {
		const originalSettings = this.state.settings;
		const originalContext = this.state.context;

		this.setState({
			editing: true,
			tempSettings: originalSettings,
			tempContext: originalContext,
		});
	}

	stopEditing (e) {
		this.setState({
			editing: false,
		});
	}

	afterFadeOut () {
		reloadEditor();
		this.setState({
			deleted: true,
			deleting: false,
		});
	}

	handleDelete () {
		axios.delete(groundhogg_endpoints.steps, {
			data: {
				step_id: this.props.step.ID,
			},
		}).then(result => this.setState({
			deleting: true,
		}));
	}

	updateSettings (newSettings, newContext) {

		const currentSettings = this.state.tempSettings;
		const currentContext = this.state.tempContext;

		this.setState({
			tempSettings: {
				...currentSettings,
				...newSettings,
			},
			tempContext: {
				...currentContext,
				...newContext,
			}
		});
	}

	commitSettings () {

		this.setState({ saving: true });

		axios.patch(groundhogg_endpoints.steps, {
			step_id: this.props.step.ID,
			settings: this.state.tempSettings,
		}).then(result => this.setState({
			settings: result.data.step.settings,
			context: result.data.step.context,
			step: result.data.step,
			saving: false,
		})).catch(error => this.setState({
			error: error,
			saving: false,
		}));
	}

	handleControlAction (key, e) {

		switch (key) {
			case 'edit':
				this.edit();
				break;
			case 'duplicate':
			case 'delete':
				this.handleDelete();
				break;
			case 'add_action':
				showAddStepForm('action', this.props.step.ID);
				break;
			case 'add_benchmark':
				showAddStepForm('benchmark', this.props.step.ID);
				break;

		}
	}

	render () {

		if (this.state.deleted) {
			return <div className={ 'step-deleted' }></div>;
		}

		const step = this.props.step;
		const type = step.data.step_type;
		const group = step.data.step_group;
		const classes = [
			step.data.step_group,
			step.data.step_type,
			'step',
			'gh-box',
			// 'round-borders'
		];

		const controls = (
			<div
				key={ this.props.key }
				className={ 'step-wrap' }
			>
				{ group === 'action' && <DelayControl step={ step }/> }
				<div className={ group === 'action'
					? 'line-left'
					: 'no-line' }>
					<div id={ step.ID } className={ classes.join(' ') }>
						<StepIcon type={ type } group={ group }
						          src={ step.icon }/>
						<span className={ 'step-title' }
						      onClick={ this.handleEdit }>
							<StepTitle
								type={ type }
								data={ this.state.data }
								context={ this.state.context }
								settings={ this.state.settings }
							/>
						</span>
						<StepControls
							handleSelect={ this.handleControlAction }
							handleClick={ this.handleEdit }
						/>
						<div className={ 'wp-clearfix' }></div>
					</div>
				</div>
				{ this.state.editing && <StepEdit
					type={ type }
					settings={ this.state.tempSettings }
					data={ this.state.data }
					context={ this.state.tempContext }
					updateSettings={ this.updateSettings }
					commit={ this.commitSettings }
					done={ this.stopEditing }
				/> }
			</div>
		);

		if (this.state.deleting) {
			return (
				<FadeOut then={ this.afterFadeOut }>
					{ controls }
				</FadeOut>
			);
		}

		return controls;
	}

}