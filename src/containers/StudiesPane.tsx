import React from 'react';
import { useSelector } from 'react-redux';
import Tab from 'react-bootstrap/Tab';

import { selectProlificStudies } from '../store/prolific/selectors';

export function StudiesPane() {
  const studies = useSelector(selectProlificStudies);

  return (
    <Tab.Pane eventKey="studies">
      {studies.length ? (
        studies.map((study) => <div key={study.id}>{study.id}</div>)
      ) : (
        <div className="text-center">No studies available.</div>
      )}
    </Tab.Pane>
  );
}
