let fs = require("fs");
let moment = require("moment");

//input.json as a 2nd argument in console
let fileName = process.argv[2];

// Operations data storage
let fees = [];

//Parsing the file
fs.readFile(fileName, function(err, contents) {
  if (err) throw err;
  let operations = JSON.parse(contents);
  // let weeksOperationsAmount = [];
  let usersWeekTotal = [];

  for (let key in operations) {
    // What's the operation's week?
    var dashSplit = operations[key].date.split("-");
    let currentWeek = moment([
      dashSplit[0],
      dashSplit[1] - 1,
      dashSplit[2]
    ]).format("W");
    var dataToBePushed = {
      user: "",
      weeks: []
    };
    if (operations.hasOwnProperty(key)) {
      //IF USER HAS NOT BEEN REGISTERED
      if (typeof usersWeekTotal[operations[key].user_id] === "undefined") {

        dataToBePushed.user = operations[key].user_id;
        let weekInfo = { [currentWeek]: operations[key].operation.amount };
        dataToBePushed.weeks[0] = weekInfo;

        usersWeekTotal.splice(operations[key].user_id, 0, dataToBePushed);
        // console.log("this is the userWeekTotal now: " + usersWeekTotal)
        // console.log(
        //   "this is the userWeekTotal now: " + JSON.stringify(usersWeekTotal)
        // );

        if (operations[key].type === "cash_in") {
          console.log("unregistered user cashed in @key: " + key)
          var calculatedFee = operations[key].operation.amount * 0.003;
          if (calculatedFee > 5) {
            calculatedFee = 5;
            fees.push(calculatedFee);
            // Don't forget the rounding!!!
          } else fees.push(calculatedFee);
        }
        if (operations[key].type === "cash_out") {
          if (operations[key].user === "natural") {
            let weekInfo = { [currentWeek]: operations[key].operation.amount };
            dataToBePushed.weeks[0] = weekInfo;
            usersWeekTotal.splice(operations[key].user_id, 0, dataToBePushed);
            if (operations[key].operation.amount < 1000) {
              var calculatedFee = 0;
              fees.push(calculatedFee);
            } else var calculatedFee = operations[key].operation.amount * 0.003;
            fees.push(calculatedFee);
          }
          if (operations[key].user === "juridical") {
            var calculatedFee = operations[key].operation.amount * 0.003;
            if (calculatedFee < 0.5) {
              calculatedFee = 0.5;
              fees.push(calculatedFee);
            } else fees.push(calculatedFee);
          }
        }
      } else if (operations[key].type === "cash_in") {
        var calculatedFee = operations[key].operation.amount * 0.003;
        if (calculatedFee > 5) {
          calculatedFee = 5;
          fees.push(calculatedFee);
          // Don't forget the rounding!!!
        } else fees.push(calculatedFee);
      } else if (operations[key].type === "cash_out") {
        if (operations[key].user === "natural") {
          // Ar skaičiuojamą savaitę jau darė pavedimų?
          // Taip
          if (
            typeof usersWeekTotal[operations[key].user_id].weeks.currentWeek !==
            "undefined"
          ) {
            //Ar pavedimų suma viršijo 1000 EUR?
            if (
              usersWeekTotal[operations[key].user_id].weeks.currentWeek > 1000
            ) {
              var calculatedFee =
                (usersWeekTotal[operations[key].user_id].weeks.currentWeek -
                  1000) *
                0.003;
              fees.push(calculatedFee);
            }
          }

          // Ne
          if (
            typeof usersWeekTotal[operations[key].user_id].weeks.currentWeek ===
            "undefined"
          ) {
            dataToBePushed.user = operations[key].user_id;
            let weekInfo = { [currentWeek]: operations[key].operation.amount };
            dataToBePushed.weeks[0] = weekInfo;
            if (operations[key].operation.amount > 1000) {
              var calculatedFee =
                (usersWeekTotal[operations[key].user_id].weeks.currentWeek -
                  1000) *
                0.003;
              fees.push(calculatedFee);
            } else var calculatedFee = 0;
            fees.push(calculatedFee);
          }

          // Ne
          else if (
            usersWeekTotal[operations[key].user_id].weeks.currentWeek > 1000
          ) {
          }
        }
        if (operations[key].user === "juridical") {
          var calculatedFee = operations[key].operation.amount * 0.003;
          if (calculatedFee < 0.5) {
            calculatedFee = 0.5;
            fees.push(calculatedFee);
          } else fees.push(calculatedFee);
        }

        // // Has this week already been registered?

        // usersWeekTotal[operations[key].user_id].weeks.map(item => {
        //   console.log("This is the week item: " + JSON.stringify(item));
        // });
        // console.log(
        //   "Turi sutapti: " +
        //     typeof usersWeekTotal[operations[key].user_id].weeks.currentWeek !=
        //     "undefined"
        // );
        // if (usersWeekTotal[operations[key].user_id].weeks == currentWeek) {
        //   console.log("wokrs!!!!!!!!!!!!1");
        // }
      }
      // console.log("User is already registered");

      // usersWeekTotal.map(item => {

      //     // console.log("usersWeekTotal loop initiated");

      //     // //If there is no user at this index
      //     // if (typeof usersWeekTotal[index] === "undefined") {
      //     //   console.log("User at this index is undefined");
      //     //
      //     //If there is a user at this index
      //     if (operations[key].user_id === item.user) {

      //       //Is the user cashing in?
      //       if (operations[key].type = "cash_in"){
      //         // console.log("CASH IN!!!!!!!!!!!!!1")
      //       }
      //       if (currentWeek === item.week) {
      //         item.totalAmount += operations[key].operation.amount
      //         // if(item.totalAmount * 0.003)
      //       }

      //       // console.log(
      //       //   "Operation's user has matched with usersWeekTotal user!"
      //       // );
      //     }

      //     // //FIND OLD / REGISTER NEW USER IN usersWeekTotal
      //     // if (item.user != operations[key].user_id) {
      //     //   usersWeekTotal.push({
      //     //     user: operations[key].user_id,
      //     //     week: currentWeek,
      //     //     totalAmount: operations[key].operation.amount,
      //     //     fees: 120
      //     //   });
      //     // }
      //     // }
      //     // else usersWeekTotal[key].push('!usersWeekTotal[key] does not work')
      //     // console.log('!usersWeekTotal[key] does not work')
      //   })

      // if (item.user == operations[key].user_id)
      //   if (operations[key].type === "cash_in") {
      //     //CASH IN OPERATION

      //     console.log("User cashed in");
      //     if (operations[key].operation.amount * 0.003 > 5) {
      //       fees[key] = 5;
      //       console.log("Fee applied: " + fees[key]);
      //     } else fees[key] = (operations[key].operation.amount / 100) * 0.03;
      //     console.log("Fee applied: " + fees[key]);
      //   }

      //   //CASH OUT OPERATION
      //   if (operations[key].type === "cash_out") {
      //     //It's a natural person
      //     if (operations[key].user_type === "natural") {
      //       console.log("Natural person cashed out");
      //       //What is the sum of operations counting from last Monday?

      //       //   weeksOperationsAmount.user_id[operations[key].user_id].weekInfo.week.push(weekNo)
      //       //   weeksOperationsAmount.user_id[operations[key].user_id].weekInfo.weeksTotal += operations[key].amount

      //       //Save the amount to weeksOperationsAmount for that user id

      //       //Determine cash outs by the user in the week

      //       //If it is below 1000.00 EUR --> operation is free

      //       //If it is above 1000.00 EUR --> Apply 0.3% fee for the total amount minus 1000.00 EUR
      //     }

      //     if (operations[key].user_type === "juridical") {
      //       console.log("Juridical person cashed out");
      //     }
      //   }
      // }

      // console.log("This is the fees data: " + fees);
    }
  }
  console.log("Final fees: " + fees);

  // console.log(usersWeekTotal);
});
// });

//             //It's a natural person

//             //What is the sum of operations counting from last Monday?

//                 //If it is below 1000.00 EUR --> operation is free

//                 //If it is above 1000.00 EUR --> Apply 0.3% fee for the total amount minus 1000.00 EUR

//                 {
//                     "percents": 0.3,
//                     "week_limit": {
//                         "amount": 1000,
//                         "currency": "EUR"
//                     }
//                 }

//                 //Fee is rounded to the smallest currency item to upper bound

//         //It's a legal person

//             //0.3% fee for every operation (min. fee is 0.5 EUR for operation)

//             {
//                 "percents": 0.3,
//                 "min": {
//                     "amount": 0.5,
//                     "currency": "EUR"
//                 }
//             }

//             //Fee is rounded to the smallest currency item to upper bound

//             let num = something

//             let n = num.toFixed(2)
