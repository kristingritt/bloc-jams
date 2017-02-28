function forEach(array, callback) {  //need to include callback as an arguement to pass through the function
// loop through all elements in the points array
	for (var i = 0; i <= array.length; i++){
		callback(array[i]);
	}
};


