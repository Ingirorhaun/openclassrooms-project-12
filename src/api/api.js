export class UserApi {
    constructor(userId, url) {
        this.url = url;
        this.userId = userId;
    }
    /**
     * @typedef {Object} UserData
     * @param {Number} id
     * @param {Object} userInfos
     * @param {String} userInfos.firstName
     * @param {String} userInfos.lastName
     * @param {Number} userInfos.age
     * @param {Number} todayScore
     * @param {Object} keyData
     * @param {Number} keyData.calorieCount
     * @param {Number} keyData.proteinCount
     * @param {Number} keyData.carbohydrateCount
     * @param {Number} keyData.lipidCount
     */
    /**
     * 
     * @returns {UserData}
     */
    async getUserById() {
        const response = await fetch(`${this.url}/user/${this.userId}`);
        const data = await response.json();
        return data.data;
    }
    /**
     * @typedef {Object} UserActivity
     * @param {Number} userId
     * @param {Object} sessions
     * @param {Array} sessions.sessions
     * @param {Number} sessions.sessions.day
     * @param {Number} sessions.sessions.sessionLength
     */
    /**
     *
     * @returns {UserActivity}
     */
    async getUserActivity() {
        const response = await fetch(`${this.url}/user/${this.userId}/activity`);
        const data = await response.json();
        return data.data;
    }
    /**
     * @typedef {Object} UserAverageSessions
     * @param {Number} userId
     * @param {Object} sessions
     * @param {Array} sessions.sessions
     * @param {Number} sessions.sessions.day
     * @param {Number} sessions.sessions.sessionLength
     */
    /**
     *
     * @returns {UserAverageSessions}
     */
    async getUserAverageSessions() {
        const response = await fetch(`${this.url}/user/${this.userId}/average-sessions`);
        const data = await response.json();
        return data.data;
    }

    /**
     * @typedef {Object} UserPerformance
     * @param {Number} userId
     * @param {Object} kind
     * @param {Array} data
     * @param {Number} data.value
     * @param {Number} data.kind
    */
    /**
     *
     * @returns {UserPerformance}
     */
    async getUserPerformance() {
        const response = await fetch(`${this.url}/user/${this.userId}/performance`);
        const data = await response.json();
        return data.data;
    }
}
