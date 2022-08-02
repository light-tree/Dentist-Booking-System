import ImageUpload from "components/CustomUpload/ImageUpload";
import PanelHeader from "components/PanelHeader/PanelHeader";
import { useParams } from "react-router-dom";
import { CardBody, CardHeader } from "reactstrap";

export function DoctorDetail() {
  const { id } = useParams();
  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
          <CardHeader tag="h4">Doctor detail</CardHeader>
          <CardBody>
              <ImageUpload/>
          </CardBody>
      </div>
    </>
  );
}
