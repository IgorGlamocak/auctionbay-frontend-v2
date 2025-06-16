import React, {FC, useEffect, useState} from 'react'
import LoggedInNavBar from '../../components/ui/LoggedInNavbar'
import MyAuctionsNavigator from '../../components/ui/navigators/myAuctionsNavigator'
import { useQuery } from 'react-query'
import {deleteAuction, fetchMyAuctions, updateAuction} from '../../api/Auctions'
import {AuctionType} from '../../models/Auctions'
import {Link} from 'react-router-dom'
import DoneSmall from '../../components/ui/tags/small/status/done'
import MoreThanADayTagSmall from '../../components/ui/tags/small/time/moreThanADay'
import LastDayTagSmall from '../../components/ui/tags/small/time/lastDay'
import {queryClient} from '../../index'
import InProgressSmall from '../../components/ui/tags/small/status/inProgress'

const Profile: FC = () => {
    const [showEditPopup, setShowEditPopup] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [image, setImage] = useState<string | null>(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [endTime, setEndTime] = useState('')

    const [currentEditAuction, setCurrentEditAuction] = useState<AuctionType | null>(null)


    const handleEditClick = (auction: AuctionType) => {
        setCurrentEditAuction(auction)
        setShowEditPopup(true)
    }
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null
        if (file) {
            setSelectedFile(file)
            const imageUrl = URL.createObjectURL(file)
            setImage(imageUrl)
        }
    }

    const clearImage = (e: { preventDefault: () => void; stopPropagation: () => void }) => {
        e.preventDefault()
        e.stopPropagation() // Stop the event from propagating further
        setImage(null)
        setSelectedFile(null)
    }


    const triggerFileInputClick = () => {
        document.getElementById('fileInput')?.click()
    }

    const handleEditFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const parts = endTime.split('.')
        const isoDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10)).toISOString()

        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('endTime', isoDate)
        if (selectedFile) {
            formData.append('image', selectedFile)
        }
        try {
            if (currentEditAuction && currentEditAuction.id) {
                await updateAuction(currentEditAuction.id, formData)
                // Here, instead of reloading the page, reset states as needed
                setShowEditPopup(false)
                setTitle('')
                setDescription('')
                setEndTime('')
                setImage(null)
                setSelectedFile(null)
                // Optionally, refresh the auctions list to reflect the update
                await queryClient.invalidateQueries('fetchMyAuctions')
            } else {
                throw new Error('No auction selected for update.')
            }
        } catch (error) {
            console.error('Failed to update auction:', error)
        }
    }



    const handleDeleteClick = async (auctionId: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this auction?')
        if (confirmed) {
            try {
                await deleteAuction(auctionId)
                await queryClient.invalidateQueries('fetchMyAuctions')
            } catch (error) {
                console.error('Error deleting auction:', error)
            }
        }
    }

    function getAuctionStatusAndTime(auction: AuctionType): [string, number | null, number | null] {
        const now = new Date()
        const startTime = new Date(auction.startTime)
        const endTime = new Date(auction.endTime)
        let hoursRemaining: number | null = null
        let daysRemaining: number | null = null

        if (now >= startTime && now <= endTime) {
            const msRemaining = endTime.getTime() - now.getTime()
            hoursRemaining = Math.ceil(msRemaining / (1000 * 60 * 60))
            daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60) / 24)
            return ['In Progress', hoursRemaining, daysRemaining]
        } else if (now > endTime) {
            return ['Done', null, null]
        } else {
            return ['Not Started', null, null]
        }
    }

    useEffect(() => {
        if (currentEditAuction) {
            setTitle(currentEditAuction.title || '')
            setDescription(currentEditAuction.description || '')
            const endDate = new Date(currentEditAuction.endTime)
            const formattedEndDate = `${endDate.getDate().toString().padStart(2, '0')}.${(endDate.getMonth() + 1).toString().padStart(2, '0')}.${endDate.getFullYear()}`
            setEndTime(formattedEndDate)
            setImage(process.env.REACT_APP_API_URL + currentEditAuction.imageUrl)
        }
    }, [currentEditAuction])


    const { data, isLoading, error } = useQuery('fetchMyAuctions', fetchMyAuctions, {
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })

    const renderAuctions = () => {
        if (isLoading) return <p>Loading...</p>
        if (error) return <p>There was an error fetching the auctions.</p>
        if (data && data.length > 0) {
            return data.map((auction: AuctionType) => {
                const [status, hoursRemaining, daysRemaining] = getAuctionStatusAndTime(auction)
                const isAuctionInProgress = status === 'In Progress'

                return (
                    <div key={auction.id} className="auction-profile-card ">
                        <Link to={`/auction/${auction.id}`} key={auction.id} style={{ textDecoration: 'none' }}>
                            <div className="in-progress-element-container">
                                {status === 'Done' ? (
                                    <DoneSmall/>
                                ) : null}

                                {daysRemaining !== null && hoursRemaining !== null ? (
                                    <>
                                        <InProgressSmall />
                                        {hoursRemaining > 25 ? (
                                            <MoreThanADayTagSmall time={daysRemaining} />
                                        ) : (
                                            <LastDayTagSmall />
                                        )}

                                    </>
                                ) : null}
                            </div>

                            <div className="element-twohundred">
                                <div className="caption-title">{auction.title}</div>
                            </div>

                            <div className="element-twohundred" style={{marginBottom: '5px', marginTop: '5px'}}>
                                {auction.currentPrice !== null ? (
                                    <div className="caption-price">{auction.currentPrice} €</div>
                                ) : (
                                    <div className="caption-price">{auction.startPrice} €</div>
                                )}

                            </div>
                        </Link>
                        <div className="auction-normal-image-container">
                            <Link to={`/auction/${auction.id}`} key={auction.id} style={{ textDecoration: 'none' }}>
                                {isAuctionInProgress ? (
                                    <img
                                        className={isAuctionInProgress ? 'auction-profile-image-editable' : 'auction-profile-image'}
                                        src={`${process.env.REACT_APP_API_URL}${auction.imageUrl}`}
                                        alt="slika"
                                        style={{ height: '150px' }}
                                    />
                                ) : (
                                    <img
                                        className={isAuctionInProgress ? 'auction-profile-image-editable' : 'auction-profile-image'}
                                        src={`${process.env.REACT_APP_API_URL}${auction.imageUrl}`}
                                        alt="slika"
                                    />
                                )}
                            </Link>
                            {isAuctionInProgress && (
                                <div className="edit-delete-container">
                                    <button className="delete-btn" onClick={() => handleDeleteClick(auction.id)}>
                                        <img style={{width: '9.33px', height: '12px'}}
                                             src="/images/icons/trash_black.png" alt="black_trash"/>
                                    </button>


                                    <button className="edit-btn" onClick={() => handleEditClick(auction)}>
                                        <div className="edit-btn-content edit-btn-text">
                                            <img
                                                style={{width: '12px', height: '12px', marginRight: '7px'}}
                                                src="/images/icons/pencil_white.png"
                                                alt="white_pencil"
                                            />
                                            Edit
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })
        }
        return (
            <>
                <div className="main-container-empty-state-bidding-won">
                    <div className="inner-empty-state-container">
                        <div className="heading-empty-state-text">Oh no, no auctions added!</div>
                        <div className="text-empty-state-text">
                            {'To add new auction click "+" button in navigation bar and new auctions will be added here!'}
                        </div>
                    </div>
                </div>
            </>
        )
    }


    return (
        <>
            <LoggedInNavBar/>
            <div className="container-1440 primaryBackground">
                <div className="parent d-flex flex-column align-items-center">
                    <MyAuctionsNavigator/>
                    <div className="main-container-won-bidding-auctions">
                        <div className={data && data.length > 0 ? 'auctions-container' : ''} style={{paddingTop: '18px'}}>
                            {renderAuctions()}
                        </div>

                        {showEditPopup && currentEditAuction && (
                            <div className="add-auction-container">
                                <h4>Edit auction</h4>
                                <form onSubmit={(e) => handleEditFormSubmit(e)}>
                                    {image ? (
                                        <div className="add-auction-image-filled" style={{
                                            position: 'relative',
                                            backgroundImage: `url(${image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}>
                                            <button type="button" onClick={clearImage} className="trash-button-image">
                                                <img src="/images/icons/trash_white.png" alt="euro" style={{width: '9.33px', height: '12px'}}/>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="add-auction-image-container-empty" onClick={triggerFileInputClick}>
                                            <div className="add-image-button add-image-button-text">
                                                Add image
                                            </div>
                                        </div>
                                    )}

                                    <input type="file" id="fileInput" style={{display: 'none'}} onChange={handleImageChange}/>
                                    <div className="add-auction-inner-container">
                                        <div className="add-auction-title-container">
                                            <div className="title-desc-text" style={{ paddingTop: '5px' }}>Title</div>
                                            <div className="auction-normal-title-container">
                                                <input type="text" value={title || currentEditAuction.title} onChange={(e) => setTitle(e.target.value)}
                                                       placeholder="Title"/>
                                            </div>
                                        </div>
                                        <div className="auction-description-container">
                                            <div className="title-desc-text">Description</div>
                                            <div className="auction-normal-title-container" style={{height: '123px'}}>
                        <textarea value={description || currentEditAuction.description}
                                  className="custom-description-rich-text"
                                  onChange={(e) => setDescription(e.target.value)}
                                  placeholder="Write description here..."
                        />
                                            </div>
                                        </div>
                                        <div className="start-price-end-date-container">
                                            <div className="start-price-container">
                                                <div className="title-desc-text">End date</div>
                                                <div className="starting-price-auction" style={{ width: '501px' }}>
                                                    <input
                                                        type="text"
                                                        style={{ width: '450px' }}
                                                        value={endTime ||
                                                            (() => {
                                                                const date = new Date(currentEditAuction.endTime)
                                                                const day = date.getDate()
                                                                const month = date.getMonth() + 1 // getMonth() returns 0-11
                                                                const year = date.getFullYear()
                                                                return `${day}.${month}.${year}`
                                                            })()
                                                        }
                                                        onChange={(e) => setEndTime(e.target.value)}
                                                        placeholder="yyyy-mm-dd"
                                                    />
                                                    <img
                                                        src="/images/icons/time_grey.png"
                                                        alt="time"
                                                        style={{width: '13px', height: '13px'}}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="profile-settings-cancel-save-container">
                                            <button type="button" className="profile-settings-cancel-btn"
                                                    onClick={() => setShowEditPopup(false)}>
                                                <h5>Cancel</h5>
                                            </button>
                                            <div className="profile-settings-save-btn">
                                                <button type="submit" style={{ border: 'none', outline: 'none', backgroundColor: 'transparent' }}>
                                                    <h5>Save Changes</h5>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    )

}

export default Profile