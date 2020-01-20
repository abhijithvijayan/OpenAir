import React, { useEffect } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
// import { useSelector, useDispatch } from 'react-redux';

const StyledHome = styled.section`
    height: 80vh;
    div {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        flex-direction: column;

        p {
            color: ${({ theme }): string => {
                return theme.pink;
            }};
            font-size: 2em;
            font-weight: ${({ theme }): string => {
                return theme.bold;
            }};
        }
    }
`;

const HomePage = (): JSX.Element => {
    const socket = io('http://localhost:8000');

    useEffect(() => {
        // console.dir(socket);
        // dispatch loadInitialDataSocket
    }, [socket]);

    useEffect(() => {
        socket.on('nice', (payload: string) => {
            console.log(`Socket server: ${payload}`); // eslint-disable-line no-console
        });

        socket.on('echo', (payload: string) => {
            console.log(`Socket server echoes: ${payload}`); // eslint-disable-line no-console
        });
    });

    const handleClick = (): SocketIOClient.Socket => {
        return socket.emit('some-event', {
            msg: 'Hello broker',
        });
    };

    return (
        <>
            <StyledHome>
                <div className="text-center">
                    <button
                        type="button"
                        onClick={(): SocketIOClient.Socket => {
                            return handleClick();
                        }}
                    >
                        Emit Message
                    </button>
                </div>
            </StyledHome>
        </>
    );
};

export default HomePage;
