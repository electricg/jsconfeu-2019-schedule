const FavInput = ({ id, day, time, show }) => {
    if (!show) {
        return null;
    }

    return (
        <input
            type="radio"
            id={`fav-${id}`}
            name={`fav-${day}-${time}`}
            className="fav__input"
        />
    );
};

const FavLabel = ({ id, show, children }) => {
    if (!show) {
        return children;
    }

    return (
        <label htmlFor={`fav-${id}`} className="fav__label">
            {children}
        </label>
    );
};

export { FavInput, FavLabel };
