//=== Save fav sessions
(function() {
    const namespace = window['🦄'].namespace;
    const inputs = [...document.querySelectorAll('input[type=radio]')];

    /**
     * Get list of IDs of checked radio input
     * @returns {string[]}
     */
    const getSelected = () => {
        const selected = inputs.filter(el => {
            return el.checked;
        });

        const ids = selected.map(el => {
            return el.id;
        });

        return ids;
    };

    /**
     * Clear all radio input
     */
    const resetInput = () => {
        inputs.forEach(el => {
            el.checked = false;
        });
    };

    /**
     * Check all the radio input with the given IDs from list
     * @param {string[]} selected
     */
    const setSelected = (selected = []) => {
        resetInput();
        selected.forEach(id => {
            const el = document.querySelector(`#${id}`);

            if (el) {
                el.click();
            }
        });
    };

    /**
     * Save list of IDs into localStorage
     * @param {string[]} selected
     */
    const saveSelected = selected => {
        localStorage.setItem(namespace, JSON.stringify(selected));
    };

    /**
     * Load list of IDs from localStorage
     * @returns {string[]}
     */
    const loadSelected = () => {
        return JSON.parse(localStorage.getItem(namespace)) || [];
    };

    /**
     * To run when the page is loaded first time
     */
    const onPageLoad = () => {
        const selected = loadSelected();
        setSelected(selected);

        inputs.forEach(el => {
            el.addEventListener('input', onRadioChange);
            el.addEventListener('click', onRadioChange);
        });
    };

    /**
     * To run when an input radio is clicked
     */
    const onRadioChange = e => {
        const input = e.currentTarget;
        const {checked} = input;
        // console.log(e.type, checked);
        setTimeout(() => {
            input.checked = !input.checked;
            const selected = getSelected();
            saveSelected(selected);
        });
    };

    window.addEventListener('load', onPageLoad);
})();

//=== Scroll to session
(function() {
    /**
     * Find current slot in relation to a given date
     * @param {string|Date} date
     * @returns {HTMLElement}
     */
    const getCurrentSlot = date => {
        const confYear = 2019;
        const confMonth = 5;
        const confDay1 = 1;
        const confDay2 = 2;

        const today = typeof date === 'string' ? new Date(date) : date;
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDay = today.getDate();

        let isConfDay = false;

        if (
            confYear === todayYear &&
            confMonth === todayMonth &&
            (confDay1 === todayDay || confDay2 === todayDay)
        ) {
            isConfDay = true;
        }

        if (!isConfDay) {
            return false;
        }

        const fiveMinutes = 5 * 1000 * 60;
        const slots = [...document.querySelectorAll('.slot')];

        // Loop through the slots, the first with a starting time earlier
        // than now is the current one.
        // Set the starting time 5 minutes earlier to consider the break
        // between each slot
        const next = slots.reduce((acc, slot) => {
            if (
                Date.parse(slot.getAttribute('datetime')) - fiveMinutes <
                today
            ) {
                acc = slot;
            }

            return acc;
        }, false);

        return next;
    };

    /**
     * Scroll to given element
     * @param {HTMLElement} el Element to scroll to
     */
    const scrollToElement = el => {
        if (el) {
            el.scrollIntoView(true);
        }
    };

    /**
     * Scroll to slot
     */
    const scrollToSlot = () => {
        const date = new Date();
        // header height including border and padding
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;

        const slot = getCurrentSlot(date);

        if (slot) {
            scrollToElement(slot);

            // now account for fixed header
            const scrolledY = window.scrollY;

            // add 1px for rounding
            if (scrolledY) {
                window.scroll(0, scrolledY - headerHeight - 1);
            }
        }
    };

    /**
     * To run when the page is loaded first time
     */
    const onPageLoad = () => {
        setTimeout(() => {
            scrollToSlot();
        }, 0);

        document.querySelector('#now').addEventListener('click', scrollToSlot);
    };

    window.addEventListener('load', onPageLoad);
})();

//=== Service Workers
(function() {
    if ('serviceWorker' in navigator) {
        /**
         * Show service worker status
         * @param {boolean} status true if sw is active
         */
        const swUIStatus = status => {
            document.querySelector('#airplane').textContent = status
                ? '✈️'
                : '';
            // console.log('sw status', !!status);
        };

        /**
         * Show service worker has been installed for the first time ever
         */
        const swUIFirstTime = () => {
            // console.log('sw first time ever');
            swUIStatus(true);
            swUIMessage('This app is now available offline!');
            swUIToggle(true);
        };

        /**
         * Show service worker has been installed
         */
        const swUIInstalled = () => {
            // console.log('sw installed');
            swUIStatus(true);
        };

        /**
         * Show that service worker has a new update to show
         */
        const swUIUpdate = () => {
            // console.log('sw there is a new update, please refresh');
            swUIMessage('This app has an update, please refresh.');
            swUIToggle(true);
        };

        /**
         * Show service worker has returned an error
         * @param {Object} err error
         */
        const swUIError = err => {
            console.error('sw registration failed: ', err);
        };

        /**
         * Show or hide the sw message
         * @param {boolean} status
         */
        const swUIToggle = status => {
            document
                .querySelector('#service-worker')
                .classList.toggle('service-worker__wrapper--show', status);
        };

        /**
         * Change the sw message
         * @param {string} msg
         */
        const swUIMessage = (msg = '') => {
            document.querySelector('#service-worker-message').textContent = msg;
        };

        /**
         * Check if service worker is active
         * @returns {boolean}
         */
        const swCheckStatus = () => {
            return !!navigator.serviceWorker.controller;
        };

        let isSWInstalled = false;

        const onStateChange = newWorker => {
            // console.log('onStateChange', newWorker.state);
            if (newWorker.state === 'activated') {
                if (!isSWInstalled) {
                    isSWInstalled = swCheckStatus();
                    swUIFirstTime();
                } else {
                    swUIInstalled();
                }
            } else if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
            ) {
                swUIUpdate();
            }
        };

        window.addEventListener('load', () => {
            document
                .querySelector('#service-worker-dismiss')
                .addEventListener('click', () => {
                    swUIToggle(false);
                });
        });

        if (window['🦄'].offlineMode) {
            isSWInstalled = swCheckStatus();

            if (isSWInstalled) {
                swUIInstalled();
            }

            navigator.serviceWorker
                .register('sw.js')
                .then(registration => {
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;

                        registration.installing.addEventListener(
                            'statechange',
                            () => onStateChange(newWorker)
                        );
                    });
                })
                .catch(err => {
                    swUIError(err);
                });
        }
    }
})();

//=== (╯°□°)╯︵ ┻━┻
(function() {
    console.log(`🦄 GitHub repo: ${window['🦄'].repo}`);
    console.log('😴 Made by https://twitter.com/electric_g');
})();
