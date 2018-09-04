QUnit.module("Geolocation Tests");

QUnit.test("Browser Supports Geolocation", function( assert ) {
    assert.expect(1);
    assert.ok(!!(navigator.geolocation), "Geolocation supported");        
});

QUnit.test("Geolocation Prompt", function( assert ) {
    assert.expect(1);

    let promptComplete = assert.async();
    function showPosition(position) {
        assert.ok( true, "Prompted User for Geolocation" ); 
        promptComplete();     
    }

    setTimeout(function() {
        navigator.geolocation.getCurrentPosition(showPosition);        
      });    
  });

QUnit.test("Geolocation Permission Allowed", function( assert ) {
    assert.timeout( 10000 ); // Timeout of 1 second
    assert.expect(1);

    let permissionGranted = null;

    let selectionComplete = assert.async();

    if (navigator.geolocation) {
        navigator.permissions.query({name: 'geolocation'}).then(function(status) {
            permissionGranted = (status === "granted");       
        }).then(function(){
            assert.ok( permissionGranted, "Permission Currently Granted" );
            selectionComplete();
        });        
    }    
  });
