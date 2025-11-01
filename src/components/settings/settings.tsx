// import  { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import AddStudent from "../form/addStudent";
// import { useTranslation } from "react-i18next";

// const Settings = () => {
//   const {t} =useTranslation()
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="flex justify-center py-10">
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button className="bg-blue-600 hover:bg-blue-700 text-white">
//            {t("add_student")}
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="max-w-lg w-full">
//           <DialogHeader>
//             <DialogTitle>{t("add_student")}</DialogTitle>
//           </DialogHeader>
//           <AddStudent onSuccess={() => setOpen(false)} />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Settings;
