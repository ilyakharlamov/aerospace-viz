import loadData from './index'

const satelliteFile = './data/20190318-china.csv'
const targetsFile = './data/20190318-china-targets.csv'

const description = {
  '2016-11-10':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
}

function init() {
  loadData(satelliteFile, targetsFile, description)
}

window.addEventListener('DOMContentLoaded', init)
