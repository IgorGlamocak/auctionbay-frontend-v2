interface MoreThanADayTagWordSmallProps {
    time: number;
}

const MoreThanADayTagWordSmall: React.FC<MoreThanADayTagWordSmallProps> = ({ time }) => {
    return (
        <div className="more-than-a-day-small">
            <div className="tags-small-text">
                {time} days
            </div>
            <img style={{ width: '10px', height: '10px' }}
                 src="/images/icons/hours_left.png"
                 alt="hrs_left"
            />
        </div>
    )
}

export default MoreThanADayTagWordSmall