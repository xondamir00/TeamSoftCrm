import { useParams } from "react-router-dom";

const GgroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id);

  return (
    <>
      <div>
        <h1>details</h1>
      </div>
    </>
  );
};

export default GgroupDetail;
