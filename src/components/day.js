import Nav from './nav';
import Slot from './slot';

const Day = ({ index, day, data, days }) => {
    return (
        <section id={`day-${day}`} className="day">
            <Nav days={days} active={index} />
            <h1>Day {index}</h1>
            {Object.keys(data).map(slot => (
                <Slot key={slot} day={day} time={slot} data={data[slot]} />
            ))}
        </section>
    );
};

export default Day;
