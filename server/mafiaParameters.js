const roles = [
    { name: 'Mafia' },
    { name: 'Citizen' },
    { name: 'Citizen' },
    { name: 'Citizen' },
    { name: 'Citizen' }
];

const roleDesc = [
    { name: 'Mafia', description: 'The Mafia’s goal is to eliminate all Citizens.' },
    { name: 'Citizen', description: 'Citizens must identify the Mafia members and vote them out.' }
];

module.exports = { roles, roleDesc };