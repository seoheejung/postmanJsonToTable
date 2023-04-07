import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
function Table() {
  const [firstItem, setData] = useState([]);

  useEffect(() => {
    axios.get('./postman_collection.json')
      .then(res => {
        const jsonString = res.data.item;
        const dataArray = Array.isArray(jsonString) ? jsonString : [];
        setData(dataArray);
      })
      .catch(err => {
        console.log(err);
      })
  }, []);

  return (
    <>
      <ReactHTMLTableToExcel
        id="test-table-xls-button"
        className="download-table-xls-button"
        table="table-to-xls"
        filename="postman_collection"
        sheet="postman_collection"
        buttonText="Download as XLS"
      />
      <table id="table-to-xls" style={{ textAlign: 'center' }}>
      <thead>
        <tr>
          <th>NAME</th>
          <th>METHOD</th>
          <th>URI</th>
          <th>INPUT</th>
          <th>OUTPUT</th>
        </tr>
      </thead>
      <tbody>
      {firstItem.map((secondItem, index1) => {
        const nameMain = secondItem?.name ? secondItem.name.replace(/"/g, '') : '';
        return(
          <>
          <tr key={`${index1}`} style={{ backgroundColor: '#fff5d7' }}>
            <td colSpan="5">{nameMain}</td>
          </tr>
          { secondItem.item?.map((item, index2) => {
            const nameStr = item?.name ? item.name.replace(/"/g, '') : '';
            const metStr = item?.request?.method ? item?.request?.method.replace(/"/g, '') : '';
            const urlStr = JSON.stringify(item?.request?.url);
            return (
              <tr key={`${index2}`}>
                <td>{nameStr}</td>
                <td>{metStr}</td>
                <td>{urlStr}</td>
                <td>
                  {item?.request?.body?.formdata?.map(req => {
                    const resKeyStr = req?.key ? req.key.replace(/"/g, '') : '';
                    const resValueStr = req?.value ? req.value.replace(/"/g, '') : '';
                    const resDesStr = req?.description ? req.description.replace(/"/g, '') : '';
                    return (
                      <div key={resKeyStr}>
                        {resKeyStr} : {resValueStr}  ( {resDesStr} );
                        <br />
                      </div>
                    );
                  })}
                </td>
                <td>
                  {item?.response?.map(res => {
                    const resName = res?.name ? res.name.replace(/"/g, '') : '';
                    const resBody = res?.body ? res.body.replace(/\\n/g, '<br />') : '';
                    return (
                      <div key={resName}>
                        {resName} : {resBody}
                        <br />
                      </div>
                    );
                  })}
                </td>
              </tr>
            );
          }
          )}
          </>
          )
          
        }
        )}
      </tbody>
    </table>
    </>
  );
}

export default Table;
