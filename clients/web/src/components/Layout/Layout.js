import React from 'react';
import styled from 'styled-components';

import Loader from '../Loader';

const BodyWrapper = styled.main`
    position: relative;
    min-height: 100vh;
    .content__wrapper {
        min-height: 100vh;
        width: 100%;
    }
`;

const Wrapper = ({ children }) => {
    // Get from props
    const isPageLoading = false;
    const renderContent = isPageLoading ? <Loader /> : children;

    return (
        <BodyWrapper>
            <div className="content__wrapper">{renderContent}</div>
        </BodyWrapper>
    );
};

export default Wrapper;
