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
        try {
            const response = await fetch(`${this.url}/user/${this.userId}`);
            if (!response.ok) {
                throw new UserApiError(`Failed to fetch user data: ${response.status}`, response);
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            if (error instanceof UserApiError) {
                throw error;
            }
            throw new UserApiError('Error fetching user data', error);
        }
    }
    /**
     * @typedef {Object} UserActivity
     * @property {Number} userId
     * @property {Object} sessions
     * @property {Array} sessions.sessions
     * @property {Number} sessions.sessions.day
     * @property {Number} sessions.sessions.kilogram
     * @property {Number} sessions.sessions.calories
     */
    /**
     *
     * @returns {UserActivity}
     */
    async getUserActivity() {
        try {
            const response = await fetch(`${this.url}/user/${this.userId}/activity`);
            if (!response.ok) {
                throw new UserApiError(`Failed to fetch activity data: ${response.status}`, response);
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            if (error instanceof UserApiError) {
                throw error;
            }
            throw new UserApiError('Error fetching user activity data', error);
        }
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
        try {
            const response = await fetch(`${this.url}/user/${this.userId}/average-sessions`);
            if (!response.ok) {
                throw new UserApiError(`Failed to fetch average sessions data: ${response.status}`, response);
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            if (error instanceof UserApiError) {
                throw error;
            }
            throw new UserApiError('Error fetching user average sessions data', error);
        }
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
        try {
            const response = await fetch(`${this.url}/user/${this.userId}/performance`);
            if (!response.ok) {
                throw new UserApiError(`Failed to fetch performance data: ${response.status}`, response);
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            if (error instanceof UserApiError) {
                throw error;
            }
            throw new UserApiError('Error fetching user performance data', error);
        }
    }
}

class UserApiError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = 'UserApiError';
        this.cause = cause;
    }
}
