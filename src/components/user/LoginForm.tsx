import { LoginUserFields, useLoginForm } from 'hooks/react-hook-form/useLogin'
import { FC, useState } from 'react'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'
import FormLabel from 'react-bootstrap/FormLabel'
import Form from 'react-bootstrap/Form'
import { Controller } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import authStore from 'stores/auth.store'
import * as API from 'api/Api'
import { observer } from 'mobx-react'
import Cookies from 'js-cookie'
const LoginForm: FC = () => {
  const navigate = useNavigate()
  const { handleSubmit, errors, control } = useLoginForm()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

    const onSubmit = handleSubmit(async (data: LoginUserFields) => {
        const response = await API.login(data)
        if (response.data?.status === 'Ok!') {
            // Login was successful
            Cookies.set('token', response.data.result.token, { secure: true, sameSite: 'strict' })
            authStore.login(response.data.result)
            navigate('/profile')
        } else {
            const errorMessage = 'User with these credentials does not exist'
            setApiError(errorMessage)
            setShowError(true)
        }
    })


  return (
      <>
          <div className='fs-2 fw-bold'>
              Welcome back!
          </div>
          <div className='fs-6'>
              Please enter your details
          </div>
          <Form className="login-form" onSubmit={onSubmit} style={{ gap: '64px' }}>
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
              <div className="d-flex justify-content-between align-items-center mb-2">
                  <Link className="text-decoration-none text-end " to="/forgotpassword">
                      Forgot password?
                  </Link>
              </div>
              <Button className="w-100 login-button" type="submit">
                  Login
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

export default observer(LoginForm)