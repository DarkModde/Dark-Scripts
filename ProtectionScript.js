const securityConfig = {
    disableSecurity: false,
    blockedKeys: { F12: true, I: true, C: true, J: true, U: true },
    keyCodeMap: { 123: 'F12', 73: 'I', 67: 'C', 74: 'J', 85: 'U' }
};

document.addEventListener('contextmenu', (e) => {
    if (!securityConfig.disableSecurity) e.preventDefault();
});

document.addEventListener('keydown', (e) => {
    if (securityConfig.disableSecurity) return;
    const key = securityConfig.keyCodeMap[e.keyCode] || e.key;
    if (key === 'F12' || (e.ctrlKey && e.shiftKey && securityConfig.blockedKeys[key])) e.preventDefault();
    if (e.ctrlKey && key === 'U') e.preventDefault();
});

const consoleProtection = new Error();
Object.defineProperties(consoleProtection, {
    toString: {
        value() {
            if ((new Error()).stack.includes('toString@')) location.reload();
        }
    },
    message: {
        get() { location.reload(); }
    }
});
console.log(consoleProtection);
