const rules = [
    {
        type: "Payment Scheme",
        rule: `
            The content would have 3 metrics for determination of how to pay the content uploaders

            -retention Ratio - an average of total time listened divided by total length of content 
            -views - number of streams 
            -length -5 minutes minimum retention per user to count as a stream 
            -value Ratio- based on likes and dislikes 
            
            Payment scheme
            Retention score is most important. The voice note with the highest retention score would be at the top of the explanations section.
            
            The payment would be
            Retention rate of 
            0.8- 1.0: N0.50k per stream
            0.5 - 0.8: N0.20k per stream 
            0 - 0.5: N0.10k
            
            
            -once the retention rate goes above 0.8 the streams from that day start counting on N0.50k per stream 
            
            -once the retention rate drops below 0.8 the streams from that day start counting on N0.20k per stream 
            
            -Once the retention rate drops to below 0.5 no payment for the streams are counted. 
            
            VALUE RATIO
            Before a voice notes becomes valid to be accessed for retention rate. The voice note must possess a total of value ratio below 1.0. 
            
            The dislike must be less than the likes. 
            (E.g if dislikes is 500 and likes is 1200: the value ratio is 0.41) thus this note can be access for its retention rate. 
            
            Value ratio: Any note that goes above 1.0 on its value ratio would automatically seize to receive any revenue from any stream that comes after that day. 
            
            
            The notes of every student has be explained and loved by all users on our platform and uploader a would not compensate for uploading sub per notes to the platform.
            
            FOR NOTES 
            The notes are the same retention system. The value ratio first needs to be less than 1.0 before it can be considered for views. Once the value system is less than one. The note would be considered to be assessed for retention ratio.
            
            The retention ratio is the total pages viewed divided by the total pages multiplied by the number of minutes spent on the note after the first 10 pages 
            
            E.g 
            Value rate: dislikes/ likes : 0.4 (accepted)
            notes pages : 50 pages 
            Pages viewed: 20 pages 
            Minutes spent after first 10 pages: 5 minutes 
            
            pages viewed / Notes pages  : 0.4
            
            Minutes spent : 10 minutes 
            
            Flat rate: N0.10k x 1000 views : N100
        `
    }
]

module.exports = rules