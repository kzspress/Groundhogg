import React from 'react';
import { Navbar } from 'react-bootstrap';
import { ExitButton } from './../ExitButton/ExitButton';

import './component.scss';
import { FunnelTitleInput } from './FunnelTitle/FunnelTitleInput';
import { FunnelStatus } from './FunnelStatus/FunnelStatus';

export function Header (props) {
	return (
		<Navbar bg="white" expand="sm" sticky="top">
			<Navbar.Brand>
				<FunnelTitleInput />
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end groundhogg-nav" >
				<FunnelStatus />
			</Navbar.Collapse>
			<ExitButton />
		</Navbar>
	)
}