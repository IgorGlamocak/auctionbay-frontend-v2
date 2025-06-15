import { RegisterUserFields, useRegisterForm } from '../../hooks/react-hook-form/useRegister'
import { FC, useEffect, useState } from 'react'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'
import FormLabel from 'react-bootstrap/FormLabel'
import Form from 'react-bootstrap/Form'
import { Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import authStore from '../../stores/auth.store'
import * as API from '../../api/Api'
import { StatusCode } from '../../constants/errorConstants'
import { observer } from 'mobx-react'

const RegisterForm: FC = () => {
    const navigate = useNavigate()
    const { handleSubmit, errors, control } = useRegisterForm()
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const [file] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [fileError, setFileError] = useState(false)

    const onSubmit = handleSubmit(async (data: RegisterUserFields) => {
        const response = await API.register(data)
        if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
            setApiError(response.data.message)
            setShowError(true)
        } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
            setApiError(response.data.message)
            setShowError(true)
        } else {
            // Login user after successful registration
            const loginResponse = await API.login({
                email: data.email,
                password: data.password,
            })
            if (loginResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
                setApiError(loginResponse.data.message)
                setShowError(true)
            } else if (loginResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
                setApiError(loginResponse.data.message)
                setShowError(true)
            } else {
                // Successfully logged in
                authStore.login(loginResponse.data)
                navigate('/')
            }
        }
    })

    const handleFileError = () => {
        if (!file) setFileError(true)
        else setFileError(false)
    }

    useEffect(() => {
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
                setFileError(false)
            }
            reader.readAsDataURL(file)
        } else {
            setPreview(null)
        }
    }, [file])

    return (
        <>
            <div className='fs-2 fw-bold'>
                Hello!
            </div>
            <div className='fs-6'>
                Please enter your details
            </div>
             <Form className="register-form" onSubmit={onSubmit}>Add commentMore actions
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Controller
                        control={control}
                        name="first_name"
                        render={({field}) => (
                            <div style={{flex: 1, marginRight: '5px'}}>
                                <Form.Group className="mb-3">
                                    <FormLabel htmlFor="first_name">Name</FormLabel>
                                    <input
                                        {...field}
                                        value={field.value ?? ''}
                                        type="text"
                                        placeholder="First name"
                                        aria-label="First name"
                                        aria-describedby="first_name"
                                        className={`form-field form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                    />
                                    {errors.first_name && (
                                        <div className="invalid-feedback text-danger">
                                            {errors.first_name.message}
                                        </div>
                                    )}
                                </Form.Group>
                            </div>
                        )}
                    />

                    <Controller
                        control={control}
                        name="last_name"
                        render={({field}) => (
                            <div style={{flex: 1, marginLeft: '5px'}}>
                                <Form.Group className="mb-3">
                                    <FormLabel htmlFor="last_name">Surname</FormLabel>
                                    <input
                                        {...field}
                                        value={field.value ?? ''}
                                        type="text"
                                        placeholder="Last name"
                                        aria-label="Last name"
                                        aria-describedby="last_name"
                                        className={`form-field form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                    />
                                    {errors.last_name && (
                                        <div className="invalid-feedback text-danger">
                                            {errors.last_name.message}
                                        </div>
                                    )}
                                </Form.Group>
                            </div>
                        )}
                    />
                </div>
                <Controller
                    control={control}
                    name="email"
                    render={({field}) => (
                        <Form.Group className="mb-3 ">
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <input
                                {...field}
                                type="email"
                                placeholder="example@gmail.com"
                                aria-label="Email"
                                aria-describedby="email"
                                className={`form-field ${errors.email ? 'is-invalid' : ''}`}
                            />
                            {errors.email && (
                                <div className="invalid-feedback text-danger">
                                    {errors.email.message}
                                </div>
                            )}
                        </Form.Group>
                    )}
                />
                <Controller
                    control={control}
                    name="password"
                    render={({field}) => (
                        <Form.Group className="mb-3">
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <input
                                {...field}
                                type="password"
                                placeholder="******"
                                aria-label="Password"
                                aria-describedby="password"
                                className={`form-field ${errors.password ? 'is-invalid' : ''}`}
                            />
                            {errors.password && (
                                <div className="invalid-feedback text-danger">
                                    {errors.password.message}
                                </div>
                            )}
                        </Form.Group>
                    )}
                />
                <Controller
                    control={control}
                    name="confirm_password"
                    render={({field}) => (
                        <Form.Group className="mb-3">
                            <FormLabel htmlFor="confirm_password">Confirm password</FormLabel>
                            <input
                                {...field}
                                type="password"
                                aria-label="Confirm password"
                                aria-describedby="confirm_password"
                                className={
                                    errors.confirm_password
                                        ? 'form-control is-invalid'
                                        : 'form-control form-field'
                                }
                            />
                            {errors.confirm_password && (
                                <div className="invalid-feedback text-danger">
                                    {errors.confirm_password.message}
                                </div>
                            )}
                        </Form.Group>
                    )}
                />
                <div className="d-flex justify-content-between align-items-center mb-2">
                </div>
                <Button className="w-100 login-button" type="submit"  onMouseUp={handleFileError}>
                    Sign up
                </Button>
            </Form>
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

export default observer(RegisterForm)