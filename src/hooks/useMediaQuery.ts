import React from 'react';

interface Props {
    query: string;
    state: boolean;
}

const formatDebugValue = ({ query, state }: Props) => `\`${query}\` => ${state}`;

function useMediaQuery(query: string, initialState: boolean) {
    const [state, setState] = React.useState(initialState);
    React.useDebugValue({ query, state }, formatDebugValue);

    React.useEffect(() => {
        let mounted = true;
        const mql = window.matchMedia(query);
        function onChange() {
            if (!mounted) {
                return;
            }
            setState(Boolean(mql.matches));
        }

        mql.addEventListener('change', onChange);
        setState(mql.matches);

        return () => {
            mounted = false;
            mql.removeEventListener('change', onChange);
        };
    }, [query]);

    return state;
}

useMediaQuery.defaultProps = {
    initialState: false,
};

export default useMediaQuery;
