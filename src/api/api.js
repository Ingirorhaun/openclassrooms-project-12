export class UserApi {
    constructor(userId, url) {
        this.url = url;
        this.userId = userId;
    }
    /**
     * @typedef {Object} UserData
     * @property {Number} id
     * @property {Object} userInfos
     * @property {String} userInfos.firstName
     * @property {String} userInfos.lastName
     * @property {Number} userInfos.age
     * @property {Number} todayScore
     * @property {Object} keyData
     * @property {Number} keyData.calorieCount
     * @property {Number} keyData.proteinCount
     * @property {Number} keyData.carbohydrateCount
     * @property {Number} keyData.lipidCount
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
     * @property {Number} userId
     * @property {Object} sessions
     * @property {Array} sessions.sessions
     * @property {Number} sessions.sessions.day
     * @property {Number} sessions.sessions.sessionLength
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
     * @property {Number} userId
     * @property {Object} sessions
     * @property {Array} sessions.sessions
     * @property {Number} sessions.sessions.day
     * @property {Number} sessions.sessions.sessionLength
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
     * @property {Number} userId
     * @property {Object} kind
     * @property {Array} data
     * @property {Number} data.value
     * @property {Number} data.kind
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
