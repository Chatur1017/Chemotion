import React, {Component} from 'react';
import {Row, Col, Input, ListGroupItem, ListGroup} from 'react-bootstrap'
import Select from 'react-select'
import {solventOptions, purificationOptions, statusOptions, dangerousProductsOptions}
  from './staticDropdownOptions/options';

export default class ReactionDetailsProperties extends Component {

  constructor(props) {
    super(props);
    const {reaction} = props;
    this.state = { reaction };
  }

  componentWillReceiveProps(nextProps) {
    const {reaction} = this.state;
    const nextReaction = nextProps.reaction;
    this.setState({ reaction: nextReaction });
  }

  handleInputChange(type, event) {
    const {onReactionChange} = this.props;
    const {value} = event.target;
    const {reaction} = this.state;
    let options = {};

    switch (type) {
      case 'name':
        reaction.name = value;
        break;
      case 'observation':
        reaction.observation = value;
        break;
      case 'status':
        reaction.status = value;
        break;
      case 'description':
        reaction.description = value;
        break;
      case 'purification':
        reaction.purification = value;
        break;
      case 'solvents':
        reaction.solvents = value;
        break;
      case 'rfValue':
        reaction.rf_value = value;
        break;
      case 'timestampStart':
        reaction.timestamp_start = value;
        break;
      case 'timestampStop':
        reaction.timestamp_stop = value;
        break;
      case 'tlcDescription':
        reaction.tlc_description = value;
        break;
      case 'temperature':
        reaction.temperature = value;
        options = {schemaChanged: true}
        break;
      case 'dangerousProducts':
        reaction.dangerous_products = value;
        break;
        case 'solvent':
          reaction.solvent = value;
          options = {schemaChanged: true}
          break;
    }

    onReactionChange(reaction, options);
  }

  handleMultiselectChange(type, selectedOptions) {
    const values = selectedOptions.map(option => option.value);
    const wrappedEvent = {target: {value: values}};
    this.handleInputChange(type, wrappedEvent)
  }

  render() {
    const {reaction} = this.state;
    return (
      <ListGroup>
        <ListGroupItem header="">
          <Row>
            <Col md={6}>
              <Input
                type="text"
                label="Name"
                value={reaction.name}
                placeholder="Name..."
                disabled={reaction.isMethodDisabled('name')}
                onChange={event => this.handleInputChange('name', event)}/>
            </Col>
            <Col md={6}>
              <label>Status</label>
              <Select
                name='status'
                multi={false}
                options={statusOptions}
                value={reaction.status}
                disabled={reaction.isMethodDisabled('status')}
                onChange={event => {
                  const wrappedEvent = {target: {value: event}};
                  this.handleInputChange('status', wrappedEvent)
                }}
                />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Input
                type="textarea"
                label="Description"
                value={reaction.description}
                disabled={reaction.isMethodDisabled('description')}
                placeholder="Description..."
                onChange={event => this.handleInputChange('description', event)}/>
            </Col>
          </Row>
        </ListGroupItem>
        <ListGroupItem header="">
          <Row>
            <Col md={4}>
              <label>Solvent</label>
              <Select
                name='solvent'
                multi={false}
                options={solventOptions}
                value={reaction.solvent}
                disabled={reaction.isMethodDisabled('solvent')}
                onChange={event => {
                  const wrappedEvent = {target: {value: event}};
                  this.handleInputChange('solvent', wrappedEvent)
                }}
              />
            </Col>
            <Col md={4}>
              <Input
                type="text"
                label="Start"
                value={reaction.timestamp_start}
                disabled={reaction.isMethodDisabled('timestamp_start')}
                placeholder="Start..."
                onChange={event => this.handleInputChange('timestampStart', event)}/>
            </Col>
            <Col md={4}>
              <Input
                type="text"
                label="Stop"
                value={reaction.timestamp_stop}
                disabled={reaction.isMethodDisabled('timestamp_stop')}
                placeholder="Stop..."
                onChange={event => this.handleInputChange('timestampStop', event)}/>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Input
                type="textarea"
                label="Observation"
                value={reaction.observation}
                disabled={reaction.isMethodDisabled('observation')}
                placeholder="Observation..."
                onChange={event => this.handleInputChange('observation', event)}/>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <label>Purification</label>
              <Select
                name='purification'
                multi={true}
                disabled={reaction.isMethodDisabled('purification')}
                options={purificationOptions}
                onChange={(event, selectedOptions) =>
                  this.handleMultiselectChange('purification', selectedOptions)}
                value={reaction.purification}
                />
            </Col>
            <Col md={6}>
              <label>Dangerous Products</label>
              <Select
                name='dangerous_products'
                multi={true}
                options={dangerousProductsOptions}
                value={reaction.dangerous_products}
                disabled={reaction.isMethodDisabled('dangerous_products')}
                onChange={(event, selectedOptions) =>
                  this.handleMultiselectChange('dangerousProducts', selectedOptions)}
              />
            </Col>
          </Row>
        </ListGroupItem>
        <ListGroupItem header="TLC-Control">
          <Row>
            <Col md={6}>
              <Input
                type="text"
                label="Solvents (parts)"
                value={reaction.solvents}
                disabled={reaction.isMethodDisabled('solvents')}
                placeholder="Solvents as parts..."
                onChange={event => this.handleInputChange('solvents', event)}/>
            </Col>
            <Col md={3}>
              <Input
                type="text"
                label="Rf-Value"
                value={reaction.rf_value}
                disabled={reaction.isMethodDisabled('rf_value')}
                placeholder="Rf-Value..."
                onChange={event => this.handleInputChange('rfValue', event)}/>
            </Col>
            <Col md={3}>
              <Input
                type="text"
                label="Temperature"
                value={reaction.temperature}
                disabled={reaction.isMethodDisabled('temperature')}
                placeholder="Temperature..."
                onChange={event => this.handleInputChange('temperature', event)}/>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Input
                type="textarea"
                label="TLC-Description"
                value={reaction.tlc_description}
                disabled={reaction.isMethodDisabled('tlc_description')}
                placeholder="TLC-Description..."
                onChange={event => this.handleInputChange('tlcDescription', event)}/>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    );
  }
}