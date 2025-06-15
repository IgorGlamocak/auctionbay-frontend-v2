interface MoreThanADayTagProps {
    time: number;
}

const MoreThanADayTag: React.FC<MoreThanADayTagProps> = ({ time }) => {
    return (
        <div className="more-than-a-day-default">
            <div className="winning-default-text">
                {time}d
            </div>
            <img style={{ width: '20px', height: '20px' }}
                 src="/images/icons/hours_left.png"
                 alt="hrs_left"
            />
        </div>
    )
}

export default MoreThanADayTag