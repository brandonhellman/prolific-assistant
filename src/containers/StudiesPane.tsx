import React from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tooltip from 'react-bootstrap/Tooltip';

import { centsToGBP } from '../functions/centsToGBP';
import { openProlificStudy } from '../functions/openProlificStudy';
import { selectProlificError, selectProlificStudies } from '../store/prolific/selectors';

export function StudiesPane() {
  const error = useSelector(selectProlificError);
  const studies = useSelector(selectProlificStudies);

  return (
    <Tab.Pane eventKey="studies">
      {studies.length ? (
        studies.map((study) => (
          <Card className="study-card" key={study.id} onClick={() => openProlificStudy(study.id)}>
            <Card.Body>
              <Container>
                <Row>
                  <Col xs="auto">
                    <img
                      src={
                        study.researcher.institution?.logo ||
                        'https://app.prolific.co/img/default_study_icon.2850c668.svg'
                      }
                      style={{ width: 64, height: 64 }}
                      alt="logo"
                    />
                  </Col>
                  <Col xs>
                    <div>
                      <b>{study.name}</b>
                    </div>
                    <div>
                      Hosted by <b>{study.researcher.name}</b>
                    </div>
                    <div className="split-with-bullets">
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="reward-tooltip">
                            <table className="tooltip-table">
                              <tbody>
                                <tr>
                                  <td>Reward:</td>
                                  <td>
                                    <strong>{centsToGBP(study.reward)}</strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </Tooltip>
                        }
                      >
                        <span>{centsToGBP(study.reward)}</span>
                      </OverlayTrigger>
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="time-tooltip">
                            <table className="tooltip-table">
                              <tbody>
                                <tr>
                                  <td>Estimated completion time:</td>
                                  <td>
                                    <strong>{study.estimated_completion_time} minutes</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Average completion time:</td>
                                  <td>
                                    <strong>{study.average_completion_time} minutes</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Maximum allowed time:</td>
                                  <td>
                                    <strong>{study.maximum_allowed_time} minutes</strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </Tooltip>
                        }
                      >
                        <span>{study.estimated_completion_time} minutes</span>
                      </OverlayTrigger>
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="per-hour-tooltip">
                            <table className="tooltip-table">
                              <tbody>
                                <tr>
                                  <td>Estimated reward per hour:</td>
                                  <td>
                                    <strong>{centsToGBP(study.estimated_reward_per_hour)}/hr</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td>Average reward per hour:</td>
                                  <td>
                                    <strong>{centsToGBP(study.average_reward_per_hour)}/hr</strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </Tooltip>
                        }
                      >
                        <span>{centsToGBP(study.estimated_reward_per_hour)}/hr</span>
                      </OverlayTrigger>
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="places-tooltip">
                            <table className="tooltip-table">
                              <tbody>
                                <tr>
                                  <td>Total available places:</td>
                                  <td>
                                    <strong>{study.total_available_places}</strong>
                                  </td>
                                </tr>

                                <tr>
                                  <td>Places taken:</td>
                                  <td>
                                    <strong>{study.places_taken}</strong>
                                  </td>
                                </tr>

                                <tr>
                                  <td>Places remaining:</td>
                                  <td>
                                    <strong>{study.total_available_places - study.places_taken}</strong>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </Tooltip>
                        }
                      >
                        <span>{study.total_available_places - study.places_taken} places remaining</span>
                      </OverlayTrigger>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
        ))
      ) : (
        <div className="p-3 text-center">
          {error === 401 ? (
            <Button variant="primary" href="https://app.prolific.co/">
              Login to Prolific.co
            </Button>
          ) : (
            'No studies available.'
          )}
        </div>
      )}
    </Tab.Pane>
  );
}
