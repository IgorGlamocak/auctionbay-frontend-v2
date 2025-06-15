import { useNavigate } from 'react-router-dom'

const ProfileNavigator = () => {
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
                <button className="profile-button navigation-text" onClick={handleToProfile}>
                    <img className="icon-image" src="/images/icons/profile_white.png" alt="profile_w" style={{width: '16px', height: '16px'}}/>
                    Profile
                </button>
            </div>
        </div>
    )
}

export default ProfileNavigator