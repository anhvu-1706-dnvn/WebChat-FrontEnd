import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import {FaReact, FaNodeJs} from "react-icons/fa";
// @material-ui/icons
import Chat from "@material-ui/icons/Chat";
import { SiSocketDotIo } from "react-icons/si";
import Fingerprint from "@material-ui/icons/Fingerprint";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import InfoArea from "components/InfoArea/InfoArea.js";

import styles from "assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

export default function ProductSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
          <h2 className={classes.title}>Let{"'"}s talk product</h2>
          <h5 className={classes.description}>
           Đây là một demo nhỏ ứng dụng các kiến thức đã học về Lập trình mạng để xây dựng nên ứng dụng Web Chat này
          </h5>
          <h5 className={classes.description}>
           Các công cụ chính để xây dựng nên Demo này : 
          </h5>
        </GridItem>
      </GridContainer>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="SocketIO"
              description="Là một Module của NodeJS. Cung cấp cho lập trình viên các đặc trưng như event, room và tự động phục hồi lại kết nối. Đây là công cụ chính để tạo nên Các App/Web Chat "
              icon={SiSocketDotIo}
              iconColor="info"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="ExpressJS"
              description="Là một Module của NodeJS. Cung cấp các thư viện cũng như công cụ để cấu thành Server phục vụ các hoạt động lưu trữ thông tin cũng như bảo mật thông tin"
              icon={FaNodeJs}
              iconColor="success"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="ReactJS"
              description="Là Framework chính sử dụng để làm giao diện cho trang Web"
              icon={FaReact}
              iconColor="info"
              vertical
            />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
