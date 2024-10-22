import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate, setIsTimeUp, setIsEndDatePassed, purpose, setShowModal }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1);
        return () => clearTimeout(timer);
    });
    const timerComponents = [];
    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
            return;
        }
        timerComponents.push(
            <span key={interval}>
                {timeLeft[interval]} {interval}{" "}
            </span>
        );
    });
    return (
        <div>
            {timerComponents.length ?
                (
                    <>
                        {purpose === 'timer' ? (
                            <>
                                {setIsTimeUp(false)}
                                {timerComponents}
                            </>
                        ) : (
                            <>
                                {setIsEndDatePassed(false)}
                                {/* {timerComponents} */}
                            </>
                        )}

                    </>
                ) : (
                    <>

                        {purpose === 'timer' ? (
                            <>
                                {setIsTimeUp(true)}
                                {timerComponents}
                                <span>Time's up!</span>
                                {setShowModal(true)}
                            </>
                        ) : (
                            <>
                                {setIsEndDatePassed(true)}
                                {/* {timerComponents} */}
                                Submission date has passed
                                {setShowModal(true)}
                            </>
                        )}
                    </>
                )}

        </div>
    );
};
export default Countdown;