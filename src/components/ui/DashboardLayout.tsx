import {FC, ReactNode} from 'react'

interface Props {
    children: ReactNode | ReactNode[]
}

const DashboardLayout: FC<Props> = ({ children }) => {
    return (
        <>
            <div className='d-flex'>
            </div>
            <div className='p-4'>{children}</div>
        </>
    )
}

export default DashboardLayout