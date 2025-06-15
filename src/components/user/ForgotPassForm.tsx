import { LoginUserFields, useLoginForm } from '../../hooks/react-hook-form/useLogin'
import { FC, useState } from 'react'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'
import FormLabel from 'react-bootstrap/FormLabel'
import Form from 'react-bootstrap/Form'
import { Controller } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react'

const LoginForm: FC = () => {
    const navigate = useNavigate()
    const { handleSubmit, errors, control } = useLoginForm()
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)

    const onSubmit = handleSubmit(async (data: LoginUserFields) => {  return null })

    return (
        <>
            <div className='fs-2 fw-bold'>
                Forgot password?
            </div>
            <div className='fs-6'>
                No worries, we will send you reset instructions
            </div>
            <Form className="login-form" onSubmit={onSubmit}>
                <Controller
                    control={control}
                    name="email"
                    render={({field}) => (
                        <Form.Group className="mb-3">
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <input
                                {...field}
                                type="email"
                                placeholder="example@gmail.com"
                                aria-label="Email"
                                aria-describedby="email"
                                className={
                                    errors.email ? 'form-control is-invalid' : 'form-control form-field'
                                }
                            />
                            {errors.email && (
                                <div className="invalid-feedback text-danger">
                                    {errors.email.message}
                                </div>
                            )}
                        </Form.Group>
                    )}
                />
                <div className="d-flex justify-content-between align-items-center mb-2">
                </div>
                <Button className="w-100 login-button" type="submit">
                    Reset password
                </Button>
            </Form>
            <Link
                to="/login"
                style={{ textDecoration: 'none', fontSize: '13px', color: 'grey' }}
            >
                <span>&lt;</span> Back to login
            </Link>

            {showError && (
                <ToastContainer className="p-3" position="top-end">
                    <Toast onClose={() => setShowError(false)} show={showError}>
                        <Toast.Header>
                            <strong className="me-auto text-danger">Error</strong>
                        </Toast.Header>
                        <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
                    </Toast>
                </ToastContainer>
            )}
        </>
    )
}

export default observer(LoginForm)