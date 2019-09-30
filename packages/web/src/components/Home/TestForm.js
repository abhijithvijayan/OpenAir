/* eslint-disable jsx-a11y/label-has-for */
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, Form } from 'react-bootstrap';

const renderInputField = ({ input, type, label, meta: { touched, invalid, error } }) => {
    const isInvalid = touched && invalid;
    return (
        <>
            <Form.Label>{label}</Form.Label>
            <Form.Control {...input} type={type} autoComplete="off" spellCheck="false" isInvalid={isInvalid} />
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        </>
    );
};

class TestForm extends Component {
    onSubmit = ({ email }) => {
        console.log(email);
    };

    render() {
        const { handleSubmit } = this.props;
        return (
            <Form onSubmit={handleSubmit(this.onSubmit)}>
                <Form.Row>
                    <Field name="email" type="email" icon="mail" component={renderInputField} label="Email" />
                </Form.Row>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        );
    }
}

const validate = formValues => {
    const errors = {};
    if (!formValues.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)) {
        errors.email = 'Invalid email address';
    }
    return errors;
};

const TestFormWrapper = connect(
    null,
    {}
)(TestForm);

export default reduxForm({
    form: 'test_form',
    validate,
})(TestFormWrapper);
