import React from 'react';
import Loader from '../Loader';

import './styles.scss';

type WrapperProperties = {
    children: React.ReactNode;
};

const Wrapper = ({ children }: WrapperProperties): JSX.Element => {
    // ToDo: Get from props
    const isPageLoading = false;
    const renderContent = isPageLoading ? <Loader /> : children;

    return (
        <main id="layout__wrapper">
            <div className="content__wrapper">{renderContent}</div>
        </main>
    );
};

export default Wrapper;
