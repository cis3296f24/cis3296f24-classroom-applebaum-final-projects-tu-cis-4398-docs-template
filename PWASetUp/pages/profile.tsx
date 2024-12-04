import Page from '../components/page';
import Section from '../components/section';
import React from 'react';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
  MDBIcon,
} from 'mdb-react-ui-kit';

const ProfileStatistics: React.FC = () => {
  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: '#121212' }} // Dark background
    >
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBCol md="12" xl="4">
            <MDBCard style={{ borderRadius: '15px', backgroundColor: '#1e1e1e' }}>
              <MDBCardBody className="text-center text-white">
                <div
                  className="d-flex justify-content-center align-items-center mt-3 mb-4"
                  style={{
                    height: '150px', // Added for vertical centering
                  }}
                >
                  <MDBCardImage
                    src="../images/Ian.png"
                    className="rounded-circle"
                    fluid
                    style={{
                      width: '100px',
                      height: '100px', // Ensures the image is square
                      objectFit: 'cover', // Ensures the image scales correctly
                    }}
                  />
                </div>

                <MDBTypography tag="h4" className="text-white">
                  Julie L. Arsenault
                </MDBTypography>
                <MDBCardText className="text-muted mb-4">
                  @Programmer <span className="mx-2">|</span>{' '}
                  <a href="#!" className="text-decoration-none text-info">
                    mdbootstrap.com
                  </a>
                </MDBCardText>
                <div className="mb-4 pb-2">
                  <MDBBtn outline floating className="text-white border-white">
                    <MDBIcon fab icon="facebook" size="lg" />
                  </MDBBtn>
                  <MDBBtn
                    outline
                    floating
                    className="mx-1 text-white border-white"
                  >
                    <MDBIcon fab icon="twitter" size="lg" />
                  </MDBBtn>
                  <MDBBtn outline floating className="text-white border-white">
                    <MDBIcon fab icon="skype" size="lg" />
                  </MDBBtn>
                </div>
                <MDBBtn rounded size="lg" color="info">
                  Message now
                </MDBBtn>
                <div className="d-flex justify-content-between text-center mt-5 mb-2">
                  <div>
                    <MDBCardText className="mb-1 h5 text-white">8471</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">
                      Wallets Balance
                    </MDBCardText>
                  </div>
                  <div className="px-3">
                    <MDBCardText className="mb-1 h5 text-white">8512</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">
                      Followers
                    </MDBCardText>
                  </div>
                  <div>
                    <MDBCardText className="mb-1 h5 text-white">4751</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">
                      Total Transactions
                    </MDBCardText>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default ProfileStatistics;
