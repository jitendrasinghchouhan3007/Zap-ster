import SyncLoader from "react-spinners/SyncLoader";

const override = {
  display: "flex",
  justifyContent: "center",
};

const Spinner = ({cssStyle="my-[8rem]"}) => {
  return (
    <>
      <div className={`${cssStyle}`}>
        <SyncLoader
          color="#febd69"
          loading={true}
          cssOverride={override}
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <h2 className="text-center mt-2">Loading...</h2>
      </div>
    </>
  );
};

export default Spinner;
