function Footer() {
  return (
    <>
      <div className="footer h-[70px] w-screen bg-[#EC2752] flex justify-center items-center flex-col  bottom-[0px] mt-auto ">
        <p className="text-white">
          &copy;{new Date().getFullYear()} Grest | All Rights Reserved
        </p>
      </div>
    </>
  );
}

export default Footer;
