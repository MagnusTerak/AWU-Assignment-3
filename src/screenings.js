
export default async function getScreenings(cmsAdapter) {
    const screenings = await cmsAdapter.loadScreenings();

      const today = new Date();  
      const inFiveDays = new Date(); 
      inFiveDays.setDate(today.getDate() + 4);  
  
     
      const filteredScreenings = screenings.filter((screening) => {
          const screeningDate = new Date(screening.attributes.start_time);
            
          return screeningDate >= today && screeningDate <= inFiveDays;
      });
      


      return filteredScreenings;
}


 