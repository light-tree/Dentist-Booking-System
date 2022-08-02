import React, { Component, useEffect, useState } from "react";
import "./style.css";
import doctorPicture from "../../assets/images/doctor.webp";
// import SlideShow from "../components/SlideShow/SlideShow";
// import ServiceType from "./components/ServiceType/ServiceType";
import SlideShow from "../SlideShow/SlideShow";
import img1 from "../../assets/images/slide (1).jpg";
import img2 from "../../assets/images/slide (2).jpg";
import img3 from "../../assets/images/slide (3).jpg";
import img4 from "../../assets/images/slide (4).jpg";
import img5 from "../../assets/images/slide (5).jpg";
import img6 from "../../assets/images/banner-nieng-rang-dep-chuan-chat-rieng-pc2.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCertificate,
  faCoffee,
  faFileCircleXmark,
  faGears,
  faIdCard,
  faLocation,
  faLocationDot,
  faPumpMedical,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";
import Feedback from "./Feedback";
import axios from "axios";
import { Col, Row } from "reactstrap";

const collection = [
  { src: img1, caption: "Đội ngũ chuyên nghiệp" },
  { src: img2, caption: "Chăm sóc tận tình" },
  { src: img3, caption: "Làm việc nhanh gọn" },
  { src: img4, caption: "Đội ngũ chuyên nghiệp" },
  { src: img5, caption: "Chăm sóc tận tình" },
  { src: img6, caption: "Làm việc nhanh gọn" },
];

const URL_GET_BRANCH = "http://localhost:8080/rade/home/branch";

export default function Home() {
  const [branhcList, setBranchList] = useState([]);
  const [urlImgBranchList, setUrlImgBranchList] = useState([]);
  const [urlImg, setUrlImg] = useState("");
  const [index, setIndex] = useState(1);
  useEffect(() => {
    axios.get(URL_GET_BRANCH).then((res) => {
      setBranchList(res.data);
      let urlListTmp = [];
      res.data.map((item) => {
        item.branchList.map((branch) => {
          console.log(branch.url);
          urlListTmp = [...urlListTmp, branch];
        });
      });
      console.log("list url", urlListTmp);
      setUrlImgBranchList(urlListTmp);
      console.log("abc", res.data);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (index >= urlImgBranchList.length - 1) {
        // console.log("true", index, urlImgBranchList.length);
        setIndex(0);
      } else {
        // console.log("fasle", index, urlImgBranchList.length);
        setIndex(index + 1);
      }
      console.log(index);
      console.log("url", urlImgBranchList.at(index));
    }, 10000);
  }, [index, urlImgBranchList]);

  return (
    <>
      <div className="App-slide">
        <SlideShow
          input={collection}
          ratio={`3:2`}
          mode={`automatic`}
          timeout={`3000`}
        />
      </div>
      <div className="home">
        <div>
          <h2 style={{ fontSize: `25px`, fontWeight: `bold` }}>
            Nha Khoa Rade- Nha khoa dẫn đầu với sự tận tâm, chuyên môn giỏi,
            thẩm mỹ cao
          </h2>
          <div>
            <p>
              NHA KHOA Rade với SỨ MỆNH: “Kiến tạo hệ sinh thái Nha Khoa cực kỳ
              đơn giản. Phụng sự con người nhanh nhất trên mọi miền đất nước”
            </p>
            <p>Với 3 trụ cột là Chính trực – Kỷ luật – Sáng tạo</p>
            <p>
              TẦM NHÌN Nha khoa Rade đến năm 2025: “Là chuỗi phòng nha khoa dẫn
              đầu Việt Nam bởi sự phục vụ tận tâm, chuyên môn giỏi và thẩm mỹ
              cao. Bằng việc vận hành cực kỳ đơn giản với tinh thần phụng sự
              khách hàng”
            </p>
            <p>
              Và để thực hiện tầm nhìn đến năm 2025, con người Nha khoa Rade 5
              giá trị cốt lõi: Tận tâm, trung thực , kỷ luật, máu lửa, học hỏi
            </p>
          </div>
          <img src={doctorPicture} alt="" />
          <p className="img-decs">
            Hơn 150 Bác sĩ Nha Khoa Rade uy tín hàng đầu, điều trị nhẹ nhàng,
            chính xác, tận tâm, luôn cập nhập nhập kiến thức từ nền y tế tiến bộ
            thế giới
          </p>
        </div>
        <div>
          <h2 style={{ fontSize: `25px`, fontWeight: `bold` }}>
            Tiêu chuẩn nha khoa Quốc tế{" "}
          </h2>
          <ul>
            <li style={{ fontSize: `18px` }}>
              Top 50 Nha khoa tốt nhất Thế Giới theo Tổ Chức Hoa Kỳ GCR
            </li>
            <li style={{ fontSize: `18px` }}>
              Tiêu chuẩn quản lý chất lượng quốc tế ISO 9001:2015 Anh Quốc
            </li>
          </ul>
          <p>
            Nha Khoa Kim đạt được chứng nhận Tiêu chuẩn quản lý chất lượng quốc
            tế ISO 9001:2015 Vương Quốc Anh cấp. Bộ tiêu chuẩn này là hệ thống
            quản lý khoa học, chặt chẽ với mục tiêu cao là nâng cao chất lượng,
            mang lại sự hài lòng cho khách hàng trên toàn hệ thống.
          </p>
          <img
            src="https://seadent.com.vn/wp-content/uploads/2021/12/y-si-nha-khoa-co-duoc-mo-phong-kham-khong.jpg"
            alt=""
          />
          <p>
            GCR là chứng nhận chất lượng quốc tế chuyên về lĩnh vực y tế và chăm
            sóc sức khỏe. Nha Khoa Kim đã chứng minh được những giá trị mang
            tính hệ thống và những tiêu chí hàng đầu về trình độ và hoạt động
            chuyên môn; cơ sở vật chất; dịch vụ; kết quả điều trị; hệ thống quản
            lý chất lượng (QA) và các tiêu chuẩn về an toàn y khoa.
          </p>
        </div>
      </div>
      {/* why choose us */}
      <div
        style={{
          border: `2px solid #0b0b90`,
          backgroundColor: `white`,
          color: `black`,
          borderRadius: `8px`,
        }}
      >
        <Row>
          <h3 style={{ color: `#0b0b90` }}>Lý do vì sao nên chọn chúng tôi</h3>
        </Row>
        <Row className="justify-content-center">
          <Col lg={5}>
            <Row className="justify-content-start">
              <FontAwesomeIcon
                icon={faUserDoctor}
                style={{ fontSize: `30px`, color: `#0b0b90` }}
              ></FontAwesomeIcon>
            </Row>
            <Row>
              <p>Chân thành, chuyên nghiệp và trách nhiệm</p>
            </Row>
          </Col>
          <Col lg={5}>
            <Row className="justify-content-start">
              <FontAwesomeIcon
                icon={faGears}
                style={{ fontSize: `30px`, color: `#0b0b90` }}
              ></FontAwesomeIcon>
            </Row>
            <Row>
              <p>Công nghệ hiện đại, tiên tiến</p>
            </Row>
          </Col>
          <Col lg={5}>
            <Row className="justify-content-start">
              <FontAwesomeIcon
                icon={faPumpMedical}
                style={{ fontSize: `30px`, color: `#0b0b90` }}
              ></FontAwesomeIcon>
            </Row>
            <Row>
              <p>Khử trùng hoàn toàn và đảm bảo an toàn</p>
            </Row>
          </Col>
          <Col lg={5}>
            <Row className="justify-content-start">
              <FontAwesomeIcon
                icon={faIdCard}
                style={{ fontSize: `30px`, color: `#0b0b90` }}
              ></FontAwesomeIcon>
            </Row>
            <Row>
              <p>
                Tất cả các giấy phép cần thiết và chứng chỉ chuyên ngành được
                chứng nhận
              </p>
            </Row>
          </Col>
        </Row>
      </div>
      <div>
        <Feedback />
      </div>
      {/* Hiện chi nhánh */}

      <Row
        className="justify-content-center mb-5"
        style={{ alignItems: `flex-start` }}
      >
        <Col
          style={{
            alignItems: `flex-start`,
            border: `2px solid #0b0b90`,
            height: `300px`,
            borderRadius: `8px`,
            backgroundColor: `white`,
          }}
        >
          <Row style={{ alignItems: `flex-start` }}>
            <h3 style={{ fontSize: `25px`, color: `#0b0b90` }}>
              Hệ thống chi nhánh
            </h3>
          </Row>
          <Row style={{ alignItems: `flex-start`, overflow: `auto` }}>
            {branhcList.map((item) => {
              return (
                <Col lg={6}>
                  <p
                    style={{
                      fontSize: `18px`,
                      fontWeight: `bold`,
                      textAlign: `left`,
                    }}
                    className="m-0"
                  >
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      style={{ color: `blue` }}
                      className="me-2"
                    />
                    {item.province.name}
                  </p>
                  <ol className="text-start">
                    {item.branchList.map((branch) => {
                      return (
                        <li style={{ fontSize: `18px` }}>
                          {branch.name}, {branch.district.name}
                        </li>
                      );
                    })}
                  </ol>
                </Col>
              );
            })}
          </Row>
        </Col>
        <Col>
          {/* {urlImgBranchList.map((item) => {
            return (
              <img
                style={{ width: `40vw` }}
                src={`https://drive.google.com/uc?id=${item}`}
                className="img-service"
              ></img>
            );
          })} */}
          <div
            style={{
              width: `100%`,
              height: `300px`,
              position: `relative`,
              borderRadius: `8px`,
            }}
          >
            <img
              style={{ width: `100%`, height: `300px`, borderRadius: `8px` }}
              src={`https://drive.google.com/uc?id=${
                urlImgBranchList.at(index)?.url
              }`}
              className="img-service"
            ></img>
            <div
              style={{
                position: `absolute`,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: `rgba(0, 0, 0, 0.5)`,
                color: `white`,
                width: `100%`,
                borderBottomLeftRadius: `8px`,
                borderBottomRightRadius: `8px`,
              }}
              // className="m-1"
            >
              <p className="m-0 p-0">
                {urlImgBranchList.at(index)?.name},{" "}
                {urlImgBranchList.at(index)?.district.name},{" "}
                {urlImgBranchList.at(index)?.district.province.name}
              </p>
              <p className="p-0 m-1">
                Thời gian làm việc:{" "}
                {urlImgBranchList.at(index)?.openTime.slice(0, 5)} -{" "}
                {urlImgBranchList.at(index)?.closeTime.slice(0, 5)}
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
