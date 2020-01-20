import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import './styles.scss';

const NotFound = (): JSX.Element => {
    return (
        <section id="not__found">
            <div>
                <p>You seem lost</p>
                <Link to="/">Get Me Home</Link>
            </div>
        </section>
    );
};

export default withRouter(NotFound);
