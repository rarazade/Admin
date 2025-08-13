import { useState } from "react";

export const Requirements = ({
  setRequirementsPC,
  setRequirementsMobile,
  requirementsPC,
  requirementsMobile,
  platform
}) => {
  
  const allSections = {
    PC: [
      {
        title: "Minimum Requirements",
        fields: [
          { label: "CPU", value: requirementsPC.PC.minReq.processor, setter: setRequirementsPC, path: ["PC", "minReq", "processor"] },
          { label: "GPU", value: requirementsPC.PC.minReq.graphics, setter: setRequirementsPC, path: ["PC", "minReq", "graphics"] },
          { label: "RAM", value: requirementsPC.PC.minReq.memory, setter: setRequirementsPC, path: ["PC", "minReq", "memory"] },
          { label: "Storage", value: requirementsPC.PC.minReq.storage, setter: setRequirementsPC, path: ["PC", "minReq", "storage"] },
        ],
      },
      {
        title: "Recommended Requirements",
        fields: [
          { label: "CPU", value: requirementsPC.PC.recReq.processor, setter: setRequirementsPC, path: ["PC", "recReq", "processor"] },
          { label: "GPU", value: requirementsPC.PC.recReq.graphics, setter: setRequirementsPC, path: ["PC", "recReq", "graphics"] },
          { label: "RAM", value: requirementsPC.PC.recReq.memory, setter: setRequirementsPC, path: ["PC", "recReq", "memory"] },
          { label: "Storage", value: requirementsPC.PC.recReq.storage, setter: setRequirementsPC, path: ["PC", "recReq", "storage"] },
        ],
      },
    ],
    Mobile: [
      {
        title: "Mobile Requirements",
        fields: [
          { label: "OS", value: requirementsMobile.Mobile.requirements.os, setter: setRequirementsMobile, path: ["Mobile", "requirements", "os"] },
          { label: "RAM", value: requirementsMobile.Mobile.requirements.memory, setter: setRequirementsMobile, path: ["Mobile", "requirements", "memory"] },
        ],
      },
    ],
  };

    const updateNestedState = (setter, path, value) => {
    setter(prev => {
      const newState = { ...prev };
      let obj = newState;
      for (let i = 0; i < path.length - 1; i++) {
        obj[path[i]] = { ...obj[path[i]] };
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = value;
      return newState;
    });
  };

  const activeSections = platform === "PC & Mobile"
    ? [...allSections.PC, ...allSections.Mobile]
    : allSections[platform] || [];

  return (
    <>
      {activeSections.map((section, i) => (
        <div key={i} className={`mt-${i === 0 ? 6 : 4}`}>
          <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
          {section.fields.map((field, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={field.label}
              value={field.value}
              onChange={(e) => updateNestedState(field.setter, field.path, e.target.value)}
              className="w-full p-2 mb-2 rounded bg-[#292F36] border border-gray-400"
            />
          ))}
        </div>
      ))}
    </>
  );
};
