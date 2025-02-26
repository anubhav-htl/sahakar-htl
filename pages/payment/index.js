import React, { useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import Layout from "../admin";
import CoopPaymentList from "../../component/CoopPaymentisting";
import MembershpiPaymentListing from "../../component/MembershpiPaymentListing";

const paymentList = () => {
  const [activeTab, setActiveTab] = useState("cooperative");

  return (
    <Layout>
      <div className=" card">
        <div className="card-body">
          <Tab.Container
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
          >
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="cooperative">Cooperative</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="member">Membership</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="mt-3">
              <Tab.Pane eventKey="cooperative">
                <h2>Cooperative Society Payments</h2>
                <CoopPaymentList />
              </Tab.Pane>
              <Tab.Pane eventKey="member">
                <h2>Membership Payments</h2>
                <MembershpiPaymentListing />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </Layout>
  );
};

export default paymentList;
