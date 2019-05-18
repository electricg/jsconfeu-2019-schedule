const Nav = ({ days, active }) => {
    return (
        <header>
            <nav>
                {days.map((day, index) => (
                    <a
                        key={day}
                        href={`#day-${day}`}
                        className={index + 1 === active ? 'active' : ''}
                    >
                        Day {index + 1}
                    </a>
                ))}
            </nav>
        </header>
    );
};

export default Nav;
