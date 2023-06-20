import { GLOBALTYPES } from './globalTypes'
import { postDataAPI } from '../../utils/fetchData'

export const REPORT_TYPES = {
  CREATE_REPORT: 'CREATE_REPORT',
}

export const createReport =
  ({ model, reportedId, reason, auth, setOnReport }) =>
  async (dispatch) => {
    try {
      const data = {
        reason,
      }
      const res = await postDataAPI(
        `${model}/${reportedId}/report`,
        data,
        auth.token
      )

      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
      setOnReport(false)
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response.data.msg },
      })
    }
  }
