import { useNavigate } from 'react-router-dom'

const AuctionsNavigator = () => {
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
                <button className="profile-button navigation-text" onClick={handleToAuctions}>
                    <img className="icon-image" src="/images/icons/home_white.png" alt="home" style={{width: '16px', height: '16px'}}/>
                    Auctions
                </button>
                <button className="auctions-nonButton navigation-text" onClick={handleToProfile}>
                    <img className="icon-image" src="/images/icons/profile_black.png" alt="profile" style={{width: '16px', height: '16px'}}/>
                    Profile
                </button>
            </div>
        </div>
    )
}

export default AuctionsNavigator