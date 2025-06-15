import { useNavigate } from 'react-router-dom'

const WhiteNavigatorProfile = () => {
    const navigate = useNavigate()

    function handleToProfile() {
        navigate('/profile')
    }

    function handleToAuctions() {
        navigate('/auctions')
    }

    return (
        <div>
            <div className="custom-box" style={{display: 'flex', gap: '8px'}}>
                <button className="auctions-nonButton navigation-text" onClick={handleToAuctions}>
                    <img className="icon-image" src="/images/icons/home_black.png" alt="home_b" style={{width: '16px', height: '16px'}}/>
                    Auctions
                </button>
                <button className="auctions-nonButton navigation-text" onClick={handleToProfile}>
                    <img className="icon-image" src="/images/icons/profile_black.png" alt="profile_w" style={{width: '16px', height: '16px'}}/>
                    Profile
                </button>
            </div>
        </div>
    )
}

export default WhiteNavigatorProfile