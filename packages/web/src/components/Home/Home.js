import React from 'react';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';

import TestForm from './TestForm';

const StyledHome = styled.section`
    height: 80vh;
    div {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        flex-direction: column;
        p {
            color: ${({ theme }) => {
                return theme.pink;
            }};
            font-size: 2em;
            font-weight: ${({ theme }) => {
                return theme.bold;
            }};
        }
    }
`;

const HomePage = () => {
    return (
        <Container>
            <StyledHome>
                <div className="text-center">
                    <p>Hello World!</p>
                    <TestForm />
                </div>
            </StyledHome>
        </Container>
    );
};

export default HomePage;
