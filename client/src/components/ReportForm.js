import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createReport } from '../redux/actions/reportAction'

const ReportForm = ({ model, reportedId, setOnReport }) => {
  const { auth, theme } = useSelector((state) => state)
  const [reason, setReason] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(createReport({ model, reportedId, reason, auth, setOnReport }))
  }

  const handleChangeReason = (e) => {
    setReason(e.target.value)
  }

  return (
    <div className="edit_profile">
      <button
        className="btn btn-danger btn_close"
        onClick={() => setOnReport(false)}
      >
        Close
      </button>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reason">Reason</label>
          <div className="position-relative">
            <input
              type="text"
              className="form-control"
              id="reason"
              name="reason"
              value={reason}
              onChange={handleChangeReason}
            />
          </div>
        </div>

        <button className="btn btn-info w-100" type="submit">
          Save
        </button>
      </form>
    </div>
  )
}

export default ReportForm
