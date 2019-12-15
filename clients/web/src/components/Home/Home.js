import React, { useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import styled from 'styled-components';
import io from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';

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
    const socket = io('http://localhost:8000');
    const dispatch = useDispatch();

    useEffect(() => {
        // console.dir(socket);
        // dispatch loadInitialDataSocket
    }, [socket]);

    useEffect(() => {
        socket.on('nice', payload => {
            console.log(`Socket server: ${payload}`);
        });

        socket.on('echo', payload => {
            console.log(`Socket server echoes: ${payload}`);
        });
    });

    const handleClick = () => {
        return socket.emit('some-event', {
            msg: 'Hello broker',
        });
    };

    return (
        <Container>
            <StyledHome>
                <div className="text-center">
                    <Button
                        type="button"
                        onClick={() => {
                            return handleClick();
                        }}
                    >
                        Emit Message
                    </Button>
                </div>
            </StyledHome>
        </Container>
    );
};

export default HomePage;
