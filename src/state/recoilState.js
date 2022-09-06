import { atom } from 'recoil';

export const accountState = atom({
    key: 'account', // unique ID (with respect to other atoms/selectors)
    default: {}, // default value (aka initial value)
});

export const loadingState = atom({
    key: 'loading', // unique ID (with respect to other atoms/selectors)
    default: false, // default value (aka initial value)
});