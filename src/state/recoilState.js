import { atom } from 'recoil';

export const accountState = atom({
    key: 'account',
    default: {},
});

export const loadingState = atom({
    key: 'loading',
    default: false,
});

export const profileState = atom({
    key: 'profile',
    default: null,
});

export const selectedArtState = atom({
    key: 'selectedArt',
    default: null,
});